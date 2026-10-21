package com.pricewise.service;

import com.pricewise.adapter.AdapterProduct;
import com.pricewise.adapter.PriceDataAdapter;
import com.pricewise.domain.dto.IngestionRunResponse;
import com.pricewise.domain.dto.ProviderInfoResponse;
import com.pricewise.domain.dto.SystemHealthSummaryResponse;
import com.pricewise.domain.entity.*;
import com.pricewise.domain.repository.*;
import com.pricewise.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.management.ManagementFactory;
import java.time.Instant;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminService {

    private final IngestionRunRepository ingestionRunRepository;
    private final RetailerRepository retailerRepository;
    private final ProductRepository productRepository;
    private final RetailerListingRepository listingRepository;
    private final PriceAlertRepository priceAlertRepository;
    private final UserRepository userRepository;
    private final List<PriceDataAdapter> adapters;

    @Transactional(readOnly = true)
    public List<IngestionRunResponse> getIngestionRuns() {
        return ingestionRunRepository.findTop10ByOrderByStartedAtDesc().stream()
                .map(this::mapToIngestionResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProviderInfoResponse> getProviders() {
        List<Retailer> retailers = retailerRepository.findAll();
        List<ProviderInfoResponse> responses = new ArrayList<>();

        for (Retailer r : retailers) {
            Optional<IngestionRun> lastRun = ingestionRunRepository.findTopByProviderCodeOrderByStartedAtDesc(r.getCode());
            long count = listingRepository.countByRetailerId(r.getId());

            responses.add(ProviderInfoResponse.builder()
                    .code(r.getCode())
                    .name(r.getName())
                    .websiteUrl(r.getWebsiteUrl())
                    .active(Boolean.TRUE.equals(r.getIsActive()))
                    .lastRunStatus(lastRun.map(ir -> ir.getStatus().name()).orElse("NEVER_RUN"))
                    .lastRunTime(lastRun.map(IngestionRun::getStartedAt).orElse(null))
                    .totalListings((int) count)
                    .build());
        }

        return responses;
    }

    @Transactional
    public IngestionRunResponse runIngestion(String providerCode) {
        PriceDataAdapter targetAdapter = adapters.stream()
                .filter(a -> a.getProviderCode().equalsIgnoreCase(providerCode))
                .findFirst()
                .orElseThrow(() -> new BadRequestException("Unknown provider adapter code: " + providerCode));

        IngestionRun run = IngestionRun.builder()
                .providerCode(targetAdapter.getProviderCode())
                .status(IngestionStatus.RUNNING)
                .startedAt(Instant.now())
                .recordsProcessed(0)
                .build();
        run = ingestionRunRepository.save(run);

        try {
            log.info("Starting ingestion run for provider: {}", targetAdapter.getProviderCode());
            List<AdapterProduct> products = targetAdapter.fetchProducts("electronics");
            int processed = products.size();

            run.setStatus(IngestionStatus.SUCCESS);
            run.setRecordsProcessed(processed);
            run.setCompletedAt(Instant.now());
            run = ingestionRunRepository.save(run);
            log.info("Ingestion run successfully completed for provider {}. Processed: {}", targetAdapter.getProviderCode(), processed);
        } catch (Exception e) {
            log.error("Ingestion failed for provider {}: {}", targetAdapter.getProviderCode(), e.getMessage(), e);
            run.setStatus(IngestionStatus.FAILED);
            run.setErrorSummary(e.getMessage());
            run.setCompletedAt(Instant.now());
            run = ingestionRunRepository.save(run);
        }

        return mapToIngestionResponse(run);
    }

    @Transactional(readOnly = true)
    public SystemHealthSummaryResponse getHealthSummary() {
        long uptime = ManagementFactory.getRuntimeMXBean().getUptime() / 1000;
        long totalProducts = productRepository.count();
        long totalListings = listingRepository.count();
        long totalAlerts = priceAlertRepository.countByStatus(AlertStatus.ACTIVE);
        long totalUsers = userRepository.count();
        int activeProviders = (int) retailerRepository.findByIsActiveTrue().size();

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("availableProcessors", Runtime.getRuntime().availableProcessors());
        metrics.put("freeMemoryMb", Runtime.getRuntime().freeMemory() / (1024 * 1024));
        metrics.put("totalMemoryMb", Runtime.getRuntime().totalMemory() / (1024 * 1024));
        metrics.put("activeAdapters", adapters.size());

        return SystemHealthSummaryResponse.builder()
                .status("UP")
                .uptimeSeconds(uptime)
                .totalProducts(totalProducts)
                .totalListings(totalListings)
                .totalActiveAlerts(totalAlerts)
                .totalUsers(totalUsers)
                .activeProviders(activeProviders)
                .systemMetrics(metrics)
                .timestamp(Instant.now())
                .build();
    }

    private IngestionRunResponse mapToIngestionResponse(IngestionRun ir) {
        return IngestionRunResponse.builder()
                .id(ir.getId())
                .providerCode(ir.getProviderCode())
                .status(ir.getStatus())
                .recordsProcessed(ir.getRecordsProcessed())
                .errorSummary(ir.getErrorSummary())
                .startedAt(ir.getStartedAt())
                .completedAt(ir.getCompletedAt())
                .build();
    }
}
