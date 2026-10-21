package com.pricewise.domain.dto;

import lombok.Builder;

import java.math.BigDecimal;
import java.time.Instant;

@Builder
public record WatchlistResponse(
    Long id,
    Long productId,
    String productTitle,
    String productBrand,
    String productCategory,
    BigDecimal currentLowestPrice,
    BigDecimal targetPrice,
    Instant createdAt
) {}
