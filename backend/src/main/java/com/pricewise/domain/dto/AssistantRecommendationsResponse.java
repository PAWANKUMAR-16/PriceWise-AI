package com.pricewise.domain.dto;

import lombok.Builder;

import java.util.List;

@Builder
public record AssistantRecommendationsResponse(
    List<ProductSummaryResponse> recommendations,
    String reasoning,
    String budgetFitAnalysis
) {}
