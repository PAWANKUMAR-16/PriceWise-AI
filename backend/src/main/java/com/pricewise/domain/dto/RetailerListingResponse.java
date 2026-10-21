package com.pricewise.domain.dto;

import lombok.Builder;

import java.time.Instant;
import java.util.List;

@Builder
public record RetailerListingResponse(
    Long id,
    Long retailerId,
    String retailerName,
    String retailerCode,
    String externalProductId,
    String productUrl,
    String variantKey,
    Boolean isActive,
    Instant lastSeenAt,
    List<OfferResponse> offers
) {}
