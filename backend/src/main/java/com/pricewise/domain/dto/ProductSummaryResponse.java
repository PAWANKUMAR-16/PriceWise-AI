package com.pricewise.domain.dto;

import lombok.Builder;

import java.math.BigDecimal;
import java.time.Instant;

@Builder
public record ProductSummaryResponse(
    Long id,
    String title,
    String brand,
    String modelNumber,
    String category,
    BigDecimal lowestPrice,
    String currency,
    int retailerCount,
    int offerCount,
    Instant createdAt
) {}
