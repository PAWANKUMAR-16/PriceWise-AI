package com.pricewise.controller;

import com.pricewise.domain.dto.PriceAlertRequest;
import com.pricewise.domain.dto.PriceAlertResponse;
import com.pricewise.domain.dto.PriceAlertUpdateStatusRequest;
import com.pricewise.security.CustomUserDetails;
import com.pricewise.service.PriceAlertService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/price-alerts")
@RequiredArgsConstructor
@Tag(name = "Price Alerts", description = "Target price threshold configuration and alert management")
@SecurityRequirement(name = "Bearer Authentication")
public class PriceAlertController {

    private final PriceAlertService priceAlertService;

    @GetMapping
    @Operation(summary = "Get user price alerts", description = "Lists all active, triggered, or paused price alerts for the current user")
    public ResponseEntity<List<PriceAlertResponse>> getUserAlerts(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(priceAlertService.getUserAlerts(userDetails.getId()));
    }

    @PostMapping
    @Operation(summary = "Create price alert", description = "Creates a new price alert that triggers when price drops below the specified target")
    public ResponseEntity<PriceAlertResponse> createAlert(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody PriceAlertRequest request
    ) {
        PriceAlertResponse response = priceAlertService.createAlert(userDetails.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update price alert", description = "Updates status (ACTIVE, PAUSED, TRIGGERED) or modifies target price for an alert")
    public ResponseEntity<PriceAlertResponse> updateAlert(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id,
            @RequestBody PriceAlertUpdateStatusRequest request
    ) {
        return ResponseEntity.ok(priceAlertService.updateAlert(userDetails.getId(), id, request));
    }
}
