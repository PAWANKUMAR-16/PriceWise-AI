package com.pricewise.adapter;

import lombok.Builder;

import java.math.BigDecimal;
import java.time.Instant;

@Builder
public record AdapterOffer(
    String externalProductId,
    String providerCode,
    BigDecimal price,
    BigDecimal shippingCost,
    String currency,
    String availability,
    String productUrl,
    Instant observedAt
) {}
