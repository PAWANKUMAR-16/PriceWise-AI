package com.pricewise.domain.dto;

import com.pricewise.domain.entity.AlertStatus;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record PriceAlertUpdateStatusRequest(
    AlertStatus status,
    BigDecimal targetPrice
) {}
