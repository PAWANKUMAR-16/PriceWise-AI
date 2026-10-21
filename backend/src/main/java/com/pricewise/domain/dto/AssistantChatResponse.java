package com.pricewise.domain.dto;

import lombok.Builder;

import java.util.List;

@Builder
public record AssistantChatResponse(
    String reply,
    List<String> suggestedActions,
    List<Long> relatedProductIds
) {}
