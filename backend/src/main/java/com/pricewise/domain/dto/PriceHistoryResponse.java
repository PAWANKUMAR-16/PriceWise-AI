package com.pricewise.domain.dto;

import lombok.Builder;

import java.math.BigDecimal;
import java.util.List;

@Builder
public record PriceHistoryResponse(
    Long productId,
    String productTitle,
    BigDecimal currentBestPrice,
    BigDecimal historicalMin,
    BigDecimal historicalMax,
    BigDecimal historicalMedian,
    int totalObservations,
    List<PriceHistoryPoint> history
) {}
