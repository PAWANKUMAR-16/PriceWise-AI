package com.pricewise.domain.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record PriceAlertRequest(
    @NotNull(message = "Product ID is required")
    Long productId,

    @NotNull(message = "Target price is required")
    @DecimalMin(value = "0.01", message = "Target price must be greater than 0")
    BigDecimal targetPrice
) {}
