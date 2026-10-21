package com.pricewise.domain.dto;

import lombok.Builder;

@Builder
public record ResolveUrlResponse(
    boolean resolved,
    String inputUrl,
    String providerCode,
    String externalProductId,
    Long productId,
    ProductResponse product,
    RetailerListingResponse listing,
    double matchConfidence,
    String message
) {}
