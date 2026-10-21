package com.pricewise.controller;

import com.pricewise.domain.dto.WatchlistRequest;
import com.pricewise.domain.dto.WatchlistResponse;
import com.pricewise.security.CustomUserDetails;
import com.pricewise.service.WatchlistService;
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
@RequestMapping("/api/v1/watchlists")
@RequiredArgsConstructor
@Tag(name = "Watchlists", description = "User product watchlist tracking endpoints")
@SecurityRequirement(name = "Bearer Authentication")
public class WatchlistController {

    private final WatchlistService watchlistService;

    @GetMapping
    @Operation(summary = "Get user watchlist", description = "Retrieves all products currently saved in the authenticated user's watchlist")
    public ResponseEntity<List<WatchlistResponse>> getWatchlist(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(watchlistService.getUserWatchlist(userDetails.getId()));
    }

    @PostMapping
    @Operation(summary = "Add to watchlist", description = "Saves a product to the user's personal watchlist with optional target price")
    public ResponseEntity<WatchlistResponse> addToWatchlist(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody WatchlistRequest request
    ) {
        WatchlistResponse response = watchlistService.addToWatchlist(userDetails.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remove from watchlist", description = "Deletes a specific product entry from the authenticated user's watchlist")
    public ResponseEntity<Void> removeFromWatchlist(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id
    ) {
        watchlistService.removeFromWatchlist(userDetails.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
