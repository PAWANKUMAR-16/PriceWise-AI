package com.pricewise.domain.dto;

import com.pricewise.domain.entity.IngestionStatus;
import lombok.Builder;

import java.time.Instant;

@Builder
public record IngestionRunResponse(
    Long id,
    String providerCode,
    IngestionStatus status,
    int recordsProcessed,
    String errorSummary,
    Instant startedAt,
    Instant completedAt
) {}
