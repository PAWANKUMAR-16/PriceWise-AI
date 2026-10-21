package com.pricewise.algorithm;

import com.pricewise.domain.dto.DealScoreResponse;
import com.pricewise.domain.entity.Offer;
import com.pricewise.domain.entity.PriceHistory;
import com.pricewise.domain.entity.Product;
import com.pricewise.domain.repository.OfferRepository;
import com.pricewise.domain.repository.PriceHistoryRepository;
import com.pricewise.domain.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DealScoringServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private PriceHistoryRepository priceHistoryRepository;

    @Mock
    private OfferRepository offerRepository;

    @InjectMocks
    private DealScoringService dealScoringService;

    private Product testProduct;

    @BeforeEach
    void setUp() {
        testProduct = Product.builder()
                .id(1L)
                .title("Apple MacBook Air M2")
                .brand("Apple")
                .modelNumber("MLXW3HN/A")
                .category("Laptops")
                .build();
    }

    @Test
    void calculateDealScore_WhenPriceIsSignificantlyBelowMedian_ReturnsHighDealScore() {
        when(productRepository.existsById(1L)).thenReturn(true);

        Offer offer = Offer.builder()
                .price(new BigDecimal("80000.00"))
                .shippingCost(BigDecimal.ZERO)
                .observedAt(Instant.now().minus(2, ChronoUnit.HOURS))
                .build();
        when(offerRepository.findCurrentOffersByProductId(1L)).thenReturn(List.of(offer));

        // Historical observations around 100,000
        List<PriceHistory> history = List.of(
                PriceHistory.builder().price(new BigDecimal("100000.00")).shippingCost(BigDecimal.ZERO).observedAt(Instant.now().minus(10, ChronoUnit.DAYS)).build(),
                PriceHistory.builder().price(new BigDecimal("102000.00")).shippingCost(BigDecimal.ZERO).observedAt(Instant.now().minus(8, ChronoUnit.DAYS)).build(),
                PriceHistory.builder().price(new BigDecimal("98000.00")).shippingCost(BigDecimal.ZERO).observedAt(Instant.now().minus(5, ChronoUnit.DAYS)).build()
        );
        when(priceHistoryRepository.findByProductIdOrderByObservedAtAsc(1L)).thenReturn(history);

        DealScoreResponse result = dealScoringService.calculateDealScore(1L);

        assertNotNull(result);
        assertTrue(result.score() >= 70.0, "Score should be high for 20% discount below median");
        assertEquals("EXCELLENT", result.dataFreshness());
        assertEquals(new BigDecimal("80000.00"), result.currentBestPrice());
    }

    @Test
    void calculateDealScore_WhenPriceIsAboveMedian_ReturnsLowerDealScore() {
        when(productRepository.existsById(1L)).thenReturn(true);

        Offer offer = Offer.builder()
                .price(new BigDecimal("120000.00"))
                .shippingCost(BigDecimal.ZERO)
                .observedAt(Instant.now().minus(1, ChronoUnit.HOURS))
                .build();
        when(offerRepository.findCurrentOffersByProductId(1L)).thenReturn(List.of(offer));

        List<PriceHistory> history = List.of(
                PriceHistory.builder().price(new BigDecimal("100000.00")).shippingCost(BigDecimal.ZERO).observedAt(Instant.now().minus(10, ChronoUnit.DAYS)).build()
        );
        when(priceHistoryRepository.findByProductIdOrderByObservedAtAsc(1L)).thenReturn(history);

        DealScoreResponse result = dealScoringService.calculateDealScore(1L);

        assertNotNull(result);
        assertTrue(result.score() < 50.0, "Score should be lower than fair price when above median");
        assertEquals(new BigDecimal("120000.00"), result.currentBestPrice());
    }
}
