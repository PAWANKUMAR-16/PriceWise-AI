package com.pricewise.domain.dto;

import com.pricewise.domain.entity.UserStatus;
import lombok.Builder;

import java.time.Instant;

@Builder
public record UserResponse(
    Long id,
    String name,
    String email,
    String role,
    UserStatus status,
    Instant createdAt
) {}
