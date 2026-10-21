package com.pricewise.algorithm;

import com.pricewise.domain.entity.Product;
import com.pricewise.domain.entity.RetailerListing;
import com.pricewise.domain.repository.RetailerListingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductMatchingService {

    private final RetailerListingRepository listingRepository;

    private static final Pattern MODEL_NUMBER_PATTERN_1 = Pattern.compile("\\b[A-Z0-9]{2,8}[-/][A-Z0-9/]{2,8}\\b", Pattern.CASE_INSENSITIVE);
    private static final Pattern MODEL_NUMBER_PATTERN_2 = Pattern.compile("\\b[A-Z]{1,4}\\d{3,5}[A-Z0-9-]*\\b", Pattern.CASE_INSENSITIVE);

    public record MatchCandidate(Product product, double similarityScore) {}

    /**
     * Normalizes a product title: lowercase, remove special characters, collapse whitespaces, trim.
     */
    public String normalizeTitle(String title) {
        if (title == null) return "";
        return title.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }

    /**
     * Regex-based model number extraction from product title and brand.
     */
    public String extractModelNumber(String title, String brand) {
        if (title == null || title.isBlank()) return null;

        // Try slash/hyphen pattern first (e.g., MLXW3HN/A, SM-S928B)
        Matcher matcher1 = MODEL_NUMBER_PATTERN_1.matcher(title);
        if (matcher1.find()) {
            return matcher1.group().toUpperCase().trim();
        }

        // Try alphanumeric hardware code (e.g., WH1000XM5, XPS9315)
        Matcher matcher2 = MODEL_NUMBER_PATTERN_2.matcher(title);
        if (matcher2.find()) {
            String candidate = matcher2.group().toUpperCase().trim();
            // Ignore common brand names if matched
            if (brand != null && candidate.equalsIgnoreCase(brand)) {
                return null;
            }
            return candidate;
        }

        return null;
    }

    /**
     * Exact ID matching via HashMap lookup.
     */
    public Optional<Product> matchByExactId(String externalId) {
        if (externalId == null || externalId.isBlank()) return Optional.empty();

        // Build lookup map from listings
        List<RetailerListing> listings = listingRepository.findAll();
        Map<String, Product> lookupMap = new HashMap<>();
        for (RetailerListing listing : listings) {
            if (listing.getExternalProductId() != null) {
                lookupMap.put(listing.getExternalProductId().trim().toLowerCase(), listing.getProduct());
            }
        }

        return Optional.ofNullable(lookupMap.get(externalId.trim().toLowerCase()));
    }

    /**
     * Calculates weighted similarity between two products:
     * - Model Number: 50%
     * - Brand: 30%
     * - Title Tokens (Jaccard similarity): 20%
     */
    public double calculateSimilarityScore(Product a, Product b) {
        if (a == null || b == null) return 0.0;

        // 1. Model number score (50%)
        double modelScore = 0.0;
        String modelA = a.getModelNumber() != null ? a.getModelNumber() : extractModelNumber(a.getTitle(), a.getBrand());
        String modelB = b.getModelNumber() != null ? b.getModelNumber() : extractModelNumber(b.getTitle(), b.getBrand());

        if (modelA != null && modelB != null) {
            if (modelA.equalsIgnoreCase(modelB)) {
                modelScore = 1.0;
            } else if (modelA.contains(modelB) || modelB.contains(modelA)) {
                modelScore = 0.7;
            }
        }

        // 2. Brand score (30%)
        double brandScore = 0.0;
        if (a.getBrand() != null && b.getBrand() != null) {
            if (a.getBrand().trim().equalsIgnoreCase(b.getBrand().trim())) {
                brandScore = 1.0;
            }
        }

        // 3. Title token score (20%) using Jaccard index
        Set<String> tokensA = tokenize(normalizeTitle(a.getTitle()));
        Set<String> tokensB = tokenize(normalizeTitle(b.getTitle()));
        double tokenScore = jaccardSimilarity(tokensA, tokensB);

        // Weighted sum
        double totalScore = (modelScore * 0.50) + (brandScore * 0.30) + (tokenScore * 0.20);
        return Math.round(totalScore * 1000.0) / 1000.0;
    }

    /**
     * Ranks candidates using a min-heap PriorityQueue for top-K selection.
     */
    public List<MatchCandidate> findTopKMatches(Product target, List<Product> candidates, int k) {
        if (target == null || candidates == null || candidates.isEmpty() || k <= 0) {
            return Collections.emptyList();
        }

        // Min-heap PriorityQueue to retain top-k highest similarity scores
        PriorityQueue<MatchCandidate> minHeap = new PriorityQueue<>(
                k,
                Comparator.comparingDouble(MatchCandidate::similarityScore)
        );

        for (Product candidate : candidates) {
            if (candidate.getId() != null && candidate.getId().equals(target.getId())) {
                continue; // skip self
            }

            double score = calculateSimilarityScore(target, candidate);
            MatchCandidate item = new MatchCandidate(candidate, score);

            if (minHeap.size() < k) {
                minHeap.offer(item);
            } else if (minHeap.peek() != null && score > minHeap.peek().similarityScore()) {
                minHeap.poll();
                minHeap.offer(item);
            }
        }

        // Extract and sort descending
        List<MatchCandidate> result = new ArrayList<>(minHeap);
        result.sort((o1, o2) -> Double.compare(o2.similarityScore(), o1.similarityScore()));
        return result;
    }

    private Set<String> tokenize(String text) {
        if (text == null || text.isBlank()) return Collections.emptySet();
        return Arrays.stream(text.split("\\s+"))
                .filter(token -> token.length() > 1)
                .collect(Collectors.toSet());
    }

    private double jaccardSimilarity(Set<String> set1, Set<String> set2) {
        if (set1.isEmpty() && set2.isEmpty()) return 1.0;
        if (set1.isEmpty() || set2.isEmpty()) return 0.0;

        Set<String> intersection = new HashSet<>(set1);
        intersection.retainAll(set2);

        Set<String> union = new HashSet<>(set1);
        union.addAll(set2);

        return (double) intersection.size() / union.size();
    }
}
