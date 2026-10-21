package com.pricewise.domain.dto;

import lombok.Builder;

import java.math.BigDecimal;
import java.time.Instant;

@Builder
public record PriceHistoryPoint(
    Instant observedAt,
    BigDecimal price,
    BigDecimal shippingCost,
    BigDecimal totalPrice,
    String currency,
    String retailerName,
    String retailerCode,
    String sourceReference
) {}
