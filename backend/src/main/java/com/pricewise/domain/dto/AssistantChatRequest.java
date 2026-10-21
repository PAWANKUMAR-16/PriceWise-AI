package com.pricewise.domain.dto;

import jakarta.validation.constraints.NotBlank;

public record AssistantChatRequest(
    @NotBlank(message = "Message cannot be empty")
    String message,

    Long contextProductId
) {}
