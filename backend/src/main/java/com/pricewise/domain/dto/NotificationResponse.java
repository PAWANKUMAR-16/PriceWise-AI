package com.pricewise.domain.dto;

import lombok.Builder;

import java.time.Instant;

@Builder
public record NotificationResponse(
    Long id,
    Long userId,
    String type,
    String payload,
    Instant readAt,
    Instant createdAt
) {}
