package com.pricewise.controller;

import com.pricewise.domain.dto.*;
import com.pricewise.security.CustomUserDetails;
import com.pricewise.service.AssistantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/assistant")
@RequiredArgsConstructor
@Tag(name = "AI Shopping Assistant", description = "AI shopping advisory, multi-product comparisons, and intelligent deal recommendations")
@SecurityRequirement(name = "Bearer Authentication")
public class AssistantController {

    private final AssistantService assistantService;

    @PostMapping("/chat")
    @Operation(summary = "Ask shopping assistant", description = "Interactive chatbot that evaluates whether a product is a good deal and answers shopping questions")
    public ResponseEntity<AssistantChatResponse> chat(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody AssistantChatRequest request
    ) {
        return ResponseEntity.ok(assistantService.processChat(userDetails.getId(), request));
    }

    @PostMapping("/compare")
    @Operation(summary = "Compare multiple products", description = "Side-by-side spec, pricing, and deal score comparison for 2-5 products")
    public ResponseEntity<AssistantCompareResponse> compare(
            @Valid @RequestBody AssistantCompareRequest request
    ) {
        return ResponseEntity.ok(assistantService.compareProducts(request));
    }

    @PostMapping("/recommendations")
    @Operation(summary = "Get tailored recommendations", description = "Generates personalized product recommendations by category, budget limit, and brand preferences")
    public ResponseEntity<AssistantRecommendationsResponse> getRecommendations(
            @RequestBody AssistantRecommendationsRequest request
    ) {
        return ResponseEntity.ok(assistantService.getRecommendations(request));
    }
}
