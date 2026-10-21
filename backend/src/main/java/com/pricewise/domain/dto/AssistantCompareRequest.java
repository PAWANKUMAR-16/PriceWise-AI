package com.pricewise.domain.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public record AssistantCompareRequest(
    @NotEmpty(message = "Product IDs list cannot be empty")
    @Size(min = 2, max = 5, message = "Can compare between 2 and 5 products")
    List<Long> productIds
) {}
