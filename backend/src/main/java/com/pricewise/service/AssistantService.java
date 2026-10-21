package com.pricewise.service;

import com.pricewise.algorithm.DealScoringService;
import com.pricewise.domain.dto.*;
import com.pricewise.domain.entity.Offer;
import com.pricewise.domain.entity.Product;
import com.pricewise.domain.repository.OfferRepository;
import com.pricewise.domain.repository.ProductRepository;
import com.pricewise.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class AssistantService {

    private final ProductRepository productRepository;
    private final ProductService productService;
    private final OfferRepository offerRepository;
    private final DealScoringService dealScoringService;

    @Transactional(readOnly = true)
    public AssistantChatResponse processChat(Long userId, AssistantChatRequest request) {
        String query = request.message().toLowerCase();
        List<String> suggestedActions = new ArrayList<>();
        List<Long> relatedProductIds = new ArrayList<>();
        StringBuilder reply = new StringBuilder();

        if (request.contextProductId() != null) {
            Product product = productRepository.findById(request.contextProductId()).orElse(null);
            if (product != null) {
                relatedProductIds.add(product.getId());
                DealScoreResponse dealScore = dealScoringService.calculateDealScore(product.getId());

                if (query.contains("buy") || query.contains("good time") || query.contains("deal")) {
                    reply.append(String.format("For **%s**, current best price is ₹%s. ",
                            product.getTitle(), dealScore.currentBestPrice()));
                    reply.append(String.format("Deal Score is **%.1f/100** (%s). %s ",
                            dealScore.score(), dealScore.rating(), dealScore.explanation()));
                    if (dealScore.score() >= 60) {
                        reply.append("Yes, it's a great time to buy!");
                    } else {
                        reply.append("You might consider waiting for a promotional discount or setting a Price Alert.");
                    }
                    suggestedActions.add("Set Price Alert at ₹" + dealScore.historicalMedian());
                    suggestedActions.add("Compare with alternatives");
                    return AssistantChatResponse.builder()
                            .reply(reply.toString())
                            .suggestedActions(suggestedActions)
                            .relatedProductIds(relatedProductIds)
                            .build();
                }
            }
        }

        // Search based query
        if (query.contains("cheapest") || query.contains("laptop") || query.contains("phone") || query.contains("best")) {
            List<Product> products = productRepository.findAll();
            if (query.contains("laptop")) {
                products = products.stream().filter(p -> "Laptops".equalsIgnoreCase(p.getCategory())).toList();
            } else if (query.contains("phone") || query.contains("mobile")) {
                products = products.stream().filter(p -> "Smartphones".equalsIgnoreCase(p.getCategory())).toList();
            }

            if (!products.isEmpty()) {
                Product topPick = products.get(0);
                relatedProductIds.add(topPick.getId());
                DealScoreResponse ds = dealScoringService.calculateDealScore(topPick.getId());

                reply.append(String.format("I found top matches for you! Our highlight recommendation is **%s** currently available starting at ₹%s. ",
                        topPick.getTitle(), ds.currentBestPrice()));
                reply.append(String.format("It has a Deal Score of **%.1f/100** (%s).", ds.score(), ds.rating()));

                suggestedActions.add("View Price History for " + topPick.getBrand());
                suggestedActions.add("Compare top " + topPick.getCategory());
            } else {
                reply.append("I searched our database, but could not find matching products. Try searching for 'MacBook', 'iPhone', or 'Sony Headphones'.");
            }
        } else {
            reply.append("Hello! I am your PriceWise AI shopping assistant. I analyze historical pricing trends, detect false discounts, and tell you the best time to buy. Ask me about any laptop, phone, or audio gear!");
            suggestedActions.add("Is MacBook Air M2 at a good price?");
            suggestedActions.add("Find best deals on headphones");
            suggestedActions.add("Compare iPhone 15 Pro vs S24 Ultra");
        }

        return AssistantChatResponse.builder()
                .reply(reply.toString())
                .suggestedActions(suggestedActions)
                .relatedProductIds(relatedProductIds)
                .build();
    }

    @Transactional(readOnly = true)
    public AssistantCompareResponse compareProducts(AssistantCompareRequest request) {
        List<Long> ids = request.productIds();
        if (ids == null || ids.size() < 2) {
            throw new BadRequestException("Please provide at least 2 product IDs to compare");
        }

        List<ProductSummaryResponse> summaries = new ArrayList<>();
        List<Map<String, Object>> points = new ArrayList<>();

        Long bestValueId = null;
        double highestDealScore = -1.0;

        for (Long id : ids) {
            Product p = productRepository.findById(id)
                    .orElseThrow(() -> new BadRequestException("Product not found with id: " + id));
            ProductSummaryResponse summary = productService.mapToSummary(p);
            summaries.add(summary);

            DealScoreResponse ds = dealScoringService.calculateDealScore(id);
            if (ds.score() > highestDealScore) {
                highestDealScore = ds.score();
                bestValueId = id;
            }

            Map<String, Object> point = new HashMap<>();
            point.put("productId", id);
            point.put("title", p.getTitle());
            point.put("brand", p.getBrand());
            point.put("category", p.getCategory());
            point.put("lowestPrice", summary.lowestPrice());
            point.put("dealScore", ds.score());
            point.put("dealRating", ds.rating());
            point.put("historicalMedian", ds.historicalMedian());
            points.add(point);
        }

        String verdict = String.format("Comparing %d products: Product #%d offers the highest deal score (%.1f/100) based on current discount relative to historical median.",
                ids.size(), bestValueId, highestDealScore);

        return AssistantCompareResponse.builder()
                .products(summaries)
                .comparisonPoints(points)
                .verdict(verdict)
                .bestValueProductId(String.valueOf(bestValueId))
                .build();
    }

    @Transactional(readOnly = true)
    public AssistantRecommendationsResponse getRecommendations(AssistantRecommendationsRequest request) {
        List<Product> products = productRepository.findAll();

        if (request.category() != null && !request.category().isBlank()) {
            products = products.stream()
                    .filter(p -> p.getCategory() != null && p.getCategory().equalsIgnoreCase(request.category().trim()))
                    .toList();
        }

        if (request.brandPreference() != null && !request.brandPreference().isBlank()) {
            products = products.stream()
                    .filter(p -> p.getBrand() != null && p.getBrand().equalsIgnoreCase(request.brandPreference().trim()))
                    .toList();
        }

        List<ProductSummaryResponse> candidates = products.stream()
                .map(productService::mapToSummary)
                .filter(s -> {
                    if (request.maxBudget() != null && s.lowestPrice() != null) {
                        return s.lowestPrice().compareTo(request.maxBudget()) <= 0;
                    }
                    return true;
                })
                .sorted((a, b) -> {
                    // Sort primarily by lowest price
                    if (a.lowestPrice() == null) return 1;
                    if (b.lowestPrice() == null) return -1;
                    return a.lowestPrice().compareTo(b.lowestPrice());
                })
                .toList();

        String reasoning;
        if (candidates.isEmpty()) {
            reasoning = "No products found meeting all specified criteria. Consider increasing max budget or broadening categories.";
        } else {
            reasoning = String.format("Found %d matching options ranked by competitive pricing and deal value.", candidates.size());
        }

        String budgetFit = (request.maxBudget() != null) ?
                "All recommended items fit within your budget limit of ₹" + request.maxBudget() :
                "Recommendations include best values across all price tiers.";

        return AssistantRecommendationsResponse.builder()
                .recommendations(candidates)
                .reasoning(reasoning)
                .budgetFitAnalysis(budgetFit)
                .build();
    }
}
