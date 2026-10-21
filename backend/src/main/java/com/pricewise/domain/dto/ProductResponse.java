package com.pricewise.domain.dto;

import lombok.Builder;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Builder
public record ProductResponse(
    Long id,
    String title,
    String brand,
    String modelNumber,
    String category,
    String attributes,
    BigDecimal currentBestPrice,
    String currency,
    Instant createdAt,
    List<RetailerListingResponse> listings
) {}
