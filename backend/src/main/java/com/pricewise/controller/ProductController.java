package com.pricewise.controller;

import com.pricewise.algorithm.DealScoringService;
import com.pricewise.domain.dto.*;
import com.pricewise.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "Product catalog search, real-time offers, historical price analysis, and deal evaluation")
public class ProductController {

    private final ProductService productService;
    private final DealScoringService dealScoringService;

    @GetMapping
    @Operation(summary = "Search products", description = "Filter products by keyword, brand, category, and price range with pagination")
    public ResponseEntity<PageResponse<ProductSummaryResponse>> searchProducts(
            @RequestParam(required = false) @Parameter(description = "Keyword search for title/brand") String q,
            @RequestParam(required = false) @Parameter(description = "Keyword search alias") String query,
            @RequestParam(required = false) @Parameter(description = "Filter by brand name") String brand,
            @RequestParam(required = false) @Parameter(description = "Filter by category name") String category,
            @RequestParam(required = false) @Parameter(description = "Minimum price") BigDecimal minPrice,
            @RequestParam(required = false) @Parameter(description = "Maximum price") BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") @Parameter(description = "Page index (0 or 1-based)") int page,
            @RequestParam(defaultValue = "10") @Parameter(description = "Page size") int size,
            @RequestParam(defaultValue = "id,desc") @Parameter(description = "Sort format: property,direction") String sort
    ) {
        String searchTerm = (q != null && !q.isBlank()) ? q : query;
        int pageIndex = page > 0 ? page - 1 : 0;

        String[] sortParams = sort.split(",");
        String sortProperty = sortParams[0];
        if (sortProperty.equals("deal_score") || sortProperty.equals("price_asc") || sortProperty.equals("price_desc")) {
            sortProperty = "id";
        }
        Sort.Direction direction = sortParams.length > 1 && sortParams[1].equalsIgnoreCase("asc") ?
                Sort.Direction.ASC : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(pageIndex, size, Sort.by(direction, sortProperty));
        PageResponse<ProductSummaryResponse> results = productService.searchProducts(searchTerm, brand, category, minPrice, maxPrice, pageable);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured products", description = "Fetch top featured products for home page")
    public ResponseEntity<List<ProductSummaryResponse>> getFeaturedProducts() {
        return ResponseEntity.ok(productService.getFeaturedProducts());
    }

    @GetMapping("/categories")
    @Operation(summary = "Get distinct categories", description = "Fetch all available product categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(productService.getCategories());
    }

    @GetMapping("/brands")
    @Operation(summary = "Get distinct brands", description = "Fetch all available product brands, optionally filtered by category")
    public ResponseEntity<List<String>> getBrands(@RequestParam(required = false) String category) {
        return ResponseEntity.ok(productService.getBrands(category));
    }

    @GetMapping("/{id:[0-9]+}")
    @Operation(summary = "Get product details", description = "Fetch product details with all retailer listings and current offers")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/{id}/offers")
    @Operation(summary = "Get product offers", description = "Fetch all current active offers across retailers for a product")
    public ResponseEntity<List<OfferResponse>> getProductOffers(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductOffers(id));
    }

    @GetMapping("/{id}/history")
    @Operation(summary = "Get price history", description = "Retrieve complete chronological price history and statistical aggregates")
    public ResponseEntity<PriceHistoryResponse> getProductHistory(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductHistory(id));
    }

    @GetMapping("/{id}/deal-score")
    @Operation(summary = "Get deal score", description = "Calculate algorithmic deal rating and discount indicator against historical median")
    public ResponseEntity<DealScoreResponse> getDealScore(@PathVariable Long id) {
        return ResponseEntity.ok(dealScoringService.calculateDealScore(id));
    }

    @GetMapping("/resolve")
    @Operation(summary = "Resolve product from retailer URL", description = "Detects retailer and external identifier (e.g. Amazon ASIN) to resolve product")
    public ResponseEntity<ResolveUrlResponse> resolveUrl(
            @RequestParam @Parameter(description = "Direct product URL from a supported retailer") String url
    ) {
        return ResponseEntity.ok(productService.resolveProductByUrl(url));
    }
}
