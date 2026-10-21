package com.pricewise.adapter;

import lombok.Builder;

import java.math.BigDecimal;
import java.util.Map;

@Builder
public record AdapterProduct(
    String externalProductId,
    String title,
    String brand,
    String modelNumber,
    String category,
    String productUrl,
    BigDecimal currentPrice,
    BigDecimal shippingCost,
    String currency,
    String availability,
    Map<String, String> attributes
) {}
