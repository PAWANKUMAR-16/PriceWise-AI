package com.pricewise.domain.dto;

import lombok.Builder;

import java.time.Instant;
import java.util.Map;

@Builder
public record SystemHealthSummaryResponse(
    String status,
    long uptimeSeconds,
    long totalProducts,
    long totalListings,
    long totalActiveAlerts,
    long totalUsers,
    int activeProviders,
    Map<String, Object> systemMetrics,
    Instant timestamp
) {}
