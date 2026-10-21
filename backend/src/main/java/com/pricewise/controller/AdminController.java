package com.pricewise.controller;

import com.pricewise.domain.dto.IngestionRunResponse;
import com.pricewise.domain.dto.ProviderInfoResponse;
import com.pricewise.domain.dto.SystemHealthSummaryResponse;
import com.pricewise.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Provider adapter management, data ingestion jobs, and system metrics (Requires ROLE_ADMIN)")
@SecurityRequirement(name = "Bearer Authentication")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/ingestion/runs")
    @Operation(summary = "Get ingestion runs", description = "Retrieves audit history of the latest data provider ingestion jobs")
    public ResponseEntity<List<IngestionRunResponse>> getIngestionRuns() {
        return ResponseEntity.ok(adminService.getIngestionRuns());
    }

    @GetMapping("/providers")
    @Operation(summary = "Get registered providers", description = "Lists all registered external retailer adapters and their last execution status")
    public ResponseEntity<List<ProviderInfoResponse>> getProviders() {
        return ResponseEntity.ok(adminService.getProviders());
    }

    @PostMapping("/ingestion/{provider}/run")
    @Operation(summary = "Trigger provider ingestion", description = "Triggers an on-demand ingestion run for a specific provider code (e.g. SYNTHETIC, AMAZON_IN)")
    public ResponseEntity<IngestionRunResponse> triggerIngestion(
            @PathVariable @Parameter(description = "Provider adapter code") String provider
    ) {
        return ResponseEntity.ok(adminService.runIngestion(provider));
    }

    @GetMapping("/health/summary")
    @Operation(summary = "Get system health summary", description = "Returns system uptime, catalog size, active alerts, and host memory metrics")
    public ResponseEntity<SystemHealthSummaryResponse> getHealthSummary() {
        return ResponseEntity.ok(adminService.getHealthSummary());
    }
}
