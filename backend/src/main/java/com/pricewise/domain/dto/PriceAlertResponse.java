package com.pricewise.domain.dto;

import com.pricewise.domain.entity.AlertStatus;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.Instant;

@Builder
public record PriceAlertResponse(
    Long id,
    Long productId,
    String productTitle,
    String productBrand,
    BigDecimal targetPrice,
    BigDecimal currentPrice,
    AlertStatus status,
    Instant lastTriggeredAt,
    Instant createdAt
) {}
