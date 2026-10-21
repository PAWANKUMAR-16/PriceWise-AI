package com.pricewise.domain.dto;

import lombok.Builder;

import java.time.Instant;

@Builder
public record ProviderInfoResponse(
    String code,
    String name,
    String websiteUrl,
    boolean active,
    String lastRunStatus,
    Instant lastRunTime,
    int totalListings
) {}
