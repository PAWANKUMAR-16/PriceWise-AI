package com.pricewise.algorithm;

import com.pricewise.domain.dto.DealScoreResponse;
import com.pricewise.domain.entity.Offer;
import com.pricewise.domain.entity.PriceHistory;
import com.pricewise.domain.repository.OfferRepository;
import com.pricewise.domain.repository.PriceHistoryRepository;
import com.pricewise.domain.repository.ProductRepository;
import com.pricewise.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DealScoringService {

    private final ProductRepository productRepository;
    private final PriceHistoryRepository priceHistoryRepository;
    private final OfferRepository offerRepository;

    @Transactional(readOnly = true)
    public DealScoreResponse calculateDealScore(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product", "id", productId);
        }

        // 1. Fetch current best offer
        List<Offer> currentOffers = offerRepository.findCurrentOffersByProductId(productId);
        BigDecimal currentPrice;
        Instant latestObservation = null;

        if (!currentOffers.isEmpty()) {
            Offer bestOffer = currentOffers.get(0);
            currentPrice = bestOffer.getPrice().add(bestOffer.getShippingCost());
            latestObservation = bestOffer.getObservedAt();
        } else {
            // Fallback to latest history point
            List<PriceHistory> history = priceHistoryRepository.findByProductIdOrderByObservedAtAsc(productId);
            if (history.isEmpty()) {
                return DealScoreResponse.builder()
                        .score(50.0)
                        .rating("NO_DATA")
                        .explanation("No pricing data currently available to evaluate deals.")
                        .historicalMin(BigDecimal.ZERO)
                        .historicalMax(BigDecimal.ZERO)
                        .historicalMedian(BigDecimal.ZERO)
                        .dataFreshnessScore(0.0)
                        .dataFreshness("NO_DATA")
                        .currentBestPrice(BigDecimal.ZERO)
                        .historicalDiscountPercentage(BigDecimal.ZERO)
                        .build();
            }
            PriceHistory latest = history.get(history.size() - 1);
            currentPrice = latest.getPrice().add(latest.getShippingCost());
            latestObservation = latest.getObservedAt();
        }

        // 2. Fetch price history for product listings
        List<PriceHistory> historyList = priceHistoryRepository.findByProductIdOrderByObservedAtAsc(productId);
        List<BigDecimal> sortedPrices = new ArrayList<>();
        for (PriceHistory ph : historyList) {
            sortedPrices.add(ph.getPrice().add(ph.getShippingCost()));
            if (latestObservation == null || ph.getObservedAt().isAfter(latestObservation)) {
                latestObservation = ph.getObservedAt();
            }
        }

        if (sortedPrices.isEmpty()) {
            sortedPrices.add(currentPrice);
        }

        // Sort price list
        Collections.sort(sortedPrices);

        BigDecimal historicalMin = sortedPrices.get(0);
        BigDecimal historicalMax = sortedPrices.get(sortedPrices.size() - 1);

        // 3. Calculate historical median price using Collections.sort + binary search
        BigDecimal historicalMedian = calculateMedian(sortedPrices);

        // Binary search to find current price index/insertion point in the historical distribution
        int searchIndex = Collections.binarySearch(sortedPrices, currentPrice);
        log.debug("Current price {} binary search index in distribution of size {}: {}", currentPrice, sortedPrices.size(), searchIndex);

        // 4. Calculate historicalDiscountIndicator = 100 * (medianPrice - currentPrice) / medianPrice
        double historicalDiscountIndicator = 0.0;
        if (historicalMedian.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal diff = historicalMedian.subtract(currentPrice);
            historicalDiscountIndicator = diff.multiply(BigDecimal.valueOf(100))
                    .divide(historicalMedian, 4, RoundingMode.HALF_UP)
                    .doubleValue();
        }

        // If discount indicator is negative (current price > median), base score starts from 50 and scales down,
        // or directly scaled: historical discount represents discount from median.
        // Normalize base score to a 0-100 scale: if price equals median -> 50 points; 20% cheaper -> 70 points, etc.
        double normalizedDiscountScore;
        if (historicalDiscountIndicator > 0) {
            // E.g., 20% discount gives 50 + (20 * 2.5) = 100
            normalizedDiscountScore = 50.0 + (historicalDiscountIndicator * 2.5);
        } else {
            // E.g., 20% above median gives 50 - (20 * 2.5) = 0
            normalizedDiscountScore = 50.0 + (historicalDiscountIndicator * 2.5);
        }

        // 5. Data freshness score: 1.0 if observed in last 24h, 0.5 if last 7 days, 0.2 otherwise
        double dataFreshnessScore = 0.2;
        String dataFreshnessLabel = "STALE";

        if (latestObservation != null) {
            Duration age = Duration.between(latestObservation, Instant.now());
            if (age.toHours() <= 24) {
                dataFreshnessScore = 1.0;
                dataFreshnessLabel = "EXCELLENT";
            } else if (age.toDays() <= 7) {
                dataFreshnessScore = 0.5;
                dataFreshnessLabel = "GOOD";
            }
        }

        // dealScore = historicalDiscountIndicator * dataFreshnessScore (clamped 0-100)
        double rawDealScore = normalizedDiscountScore * dataFreshnessScore;
        double clampedScore = Math.max(0.0, Math.min(100.0, Math.round(rawDealScore * 10.0) / 10.0));

        String rating;
        String explanation;
        if (clampedScore >= 80.0) {
            rating = "GREAT_DEAL";
            explanation = String.format("Outstanding deal! Current price (%s) is significantly lower than historical median (%s). Data freshness is %s.",
                    currentPrice, historicalMedian, dataFreshnessLabel);
        } else if (clampedScore >= 60.0) {
            rating = "GOOD_DEAL";
            explanation = String.format("Good buy! Current price (%s) is below historical median (%s) with %s data freshness.",
                    currentPrice, historicalMedian, dataFreshnessLabel);
        } else if (clampedScore >= 40.0) {
            rating = "FAIR_PRICE";
            explanation = String.format("Fair market price. Price (%s) is near historical median (%s).",
                    currentPrice, historicalMedian);
        } else {
            rating = "OVERPRICED";
            explanation = String.format("Wait for a price drop! Current price (%s) is higher than historical median (%s) or data is dated.",
                    currentPrice, historicalMedian);
        }

        BigDecimal discountPct = BigDecimal.valueOf(Math.round(historicalDiscountIndicator * 100.0) / 100.0);

        return DealScoreResponse.builder()
                .score(clampedScore)
                .rating(rating)
                .explanation(explanation)
                .historicalMin(historicalMin)
                .historicalMax(historicalMax)
                .historicalMedian(historicalMedian)
                .dataFreshnessScore(dataFreshnessScore)
                .dataFreshness(dataFreshnessLabel)
                .currentBestPrice(currentPrice)
                .historicalDiscountPercentage(discountPct)
                .build();
    }

    private BigDecimal calculateMedian(List<BigDecimal> sorted) {
        int size = sorted.size();
        if (size == 0) return BigDecimal.ZERO;
        if (size % 2 == 1) {
            return sorted.get(size / 2);
        } else {
            BigDecimal mid1 = sorted.get((size / 2) - 1);
            BigDecimal mid2 = sorted.get(size / 2);
            return mid1.add(mid2).divide(BigDecimal.valueOf(2), 2, RoundingMode.HALF_UP);
        }
    }
}
