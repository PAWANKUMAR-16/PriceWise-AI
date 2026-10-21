package com.pricewise.domain.dto;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record DealScoreResponse(
    double score,
    String rating,
    String explanation,
    BigDecimal historicalMin,
    BigDecimal historicalMax,
    BigDecimal historicalMedian,
    double dataFreshnessScore,
    String dataFreshness,
    BigDecimal currentBestPrice,
    BigDecimal historicalDiscountPercentage
) {}
