package com.pricewise.service;

import com.pricewise.domain.entity.AlertStatus;
import com.pricewise.domain.entity.Offer;
import com.pricewise.domain.entity.PriceAlert;
import com.pricewise.domain.repository.OfferRepository;
import com.pricewise.domain.repository.PriceAlertRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class AlertProcessorScheduler {

    private final PriceAlertRepository priceAlertRepository;
    private final OfferRepository offerRepository;
    private final NotificationService notificationService;

    /**
     * Executes every 5 minutes to evaluate active price alerts against current lowest market prices.
     */
    @Scheduled(fixedRate = 300000, initialDelay = 10000)
    @Transactional
    public void evaluateActiveAlerts() {
        log.info("Starting Price Alert Processor run...");

        List<PriceAlert> activeAlerts = priceAlertRepository.findAllWithProductAndUserByStatus(AlertStatus.ACTIVE);
        int triggeredCount = 0;

        for (PriceAlert alert : activeAlerts) {
            try {
                List<Offer> currentOffers = offerRepository.findCurrentOffersByProductId(alert.getProduct().getId());
                if (currentOffers.isEmpty()) {
                    continue;
                }

                Offer bestOffer = currentOffers.get(0);
                BigDecimal currentTotal = bestOffer.getPrice().add(bestOffer.getShippingCost());

                // Condition: Current price is at or below target price
                if (currentTotal.compareTo(alert.getTargetPrice()) <= 0) {
                    // Duplicate prevention: avoid re-triggering if already notified within last 24 hours
                    if (alert.getLastTriggeredAt() != null) {
                        Duration durationSinceLastTrigger = Duration.between(alert.getLastTriggeredAt(), Instant.now());
                        if (durationSinceLastTrigger.toHours() < 24) {
                            continue;
                        }
                    }

                    // Build JSON payload
                    String payload = String.format(
                            "{\"productId\": %d, \"productTitle\": \"%s\", \"retailer\": \"%s\", \"currentPrice\": %s, \"targetPrice\": %s, \"productUrl\": \"%s\"}",
                            alert.getProduct().getId(),
                            escapeJson(alert.getProduct().getTitle()),
                            escapeJson(bestOffer.getListing().getRetailer().getName()),
                            currentTotal,
                            alert.getTargetPrice(),
                            escapeJson(bestOffer.getListing().getProductUrl())
                    );

                    notificationService.createNotification(alert.getUser(), "PRICE_DROP", payload);

                    alert.setStatus(AlertStatus.TRIGGERED);
                    alert.setLastTriggeredAt(Instant.now());
                    priceAlertRepository.save(alert);
                    triggeredCount++;

                    log.info("Triggered price alert ID {} for user {} on product '{}' at price {}",
                            alert.getId(), alert.getUser().getEmail(), alert.getProduct().getTitle(), currentTotal);
                }
            } catch (Exception e) {
                log.error("Failed to process price alert ID {}: {}", alert.getId(), e.getMessage(), e);
            }
        }

        log.info("Price Alert Processor completed: {} active alerts checked, {} alerts triggered",
                activeAlerts.size(), triggeredCount);
    }

    private String escapeJson(String input) {
        if (input == null) return "";
        return input.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
