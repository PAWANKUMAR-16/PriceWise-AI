package com.pricewise.domain.dto;

import java.math.BigDecimal;
import java.util.List;

public record AssistantRecommendationsRequest(
    String category,
    BigDecimal maxBudget,
    String brandPreference,
    List<String> featurePreferences
) {}
