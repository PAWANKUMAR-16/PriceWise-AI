package com.pricewise.domain.dto;

import lombok.Builder;

import java.util.List;
import java.util.Map;

@Builder
public record AssistantCompareResponse(
    List<ProductSummaryResponse> products,
    List<Map<String, Object>> comparisonPoints,
    String verdict,
    String bestValueProductId
) {}
