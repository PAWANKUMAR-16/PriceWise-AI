package com.pricewise.domain.dto;

import lombok.Builder;

import java.math.BigDecimal;
import java.time.Instant;

@Builder
public record OfferResponse(
    Long id,
    Long listingId,
    String retailerName,
    String retailerCode,
    BigDecimal price,
    BigDecimal shippingCost,
    BigDecimal totalPrice,
    String currency,
    String availability,
    Instant observedAt,
    String productUrl
) {}
