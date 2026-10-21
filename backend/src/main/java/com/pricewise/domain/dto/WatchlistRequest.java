package com.pricewise.domain.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record WatchlistRequest(
    @NotNull(message = "Product ID is required")
    Long productId,

    BigDecimal targetPrice
) {}
