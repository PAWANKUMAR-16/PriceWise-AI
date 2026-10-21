package com.pricewise.algorithm;

import com.pricewise.domain.entity.Product;
import com.pricewise.domain.repository.RetailerListingRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class ProductMatchingServiceTest {

    @Mock
    private RetailerListingRepository listingRepository;

    @InjectMocks
    private ProductMatchingService matchingService;

    @Test
    void normalizeTitle_StripsPunctuationAndLowercases() {
        String input = "Apple MacBook Air (M2, 13.6-inch, 256GB SSD) - Midnight!!";
        String normalized = matchingService.normalizeTitle(input);
        assertEquals("apple macbook air m2 13 6 inch 256gb ssd midnight", normalized);
    }

    @Test
    void extractModelNumber_ExtractsAccurately() {
        String title1 = "Apple MacBook Air M2 MLXW3HN/A Midnight";
        String model1 = matchingService.extractModelNumber(title1, "Apple");
        assertEquals("MLXW3HN/A", model1);

        String title2 = "Sony Noise Cancelling Headphones WH1000XM5 Black";
        String model2 = matchingService.extractModelNumber(title2, "Sony");
        assertEquals("WH1000XM5", model2);
    }

    @Test
    void calculateSimilarityScore_MatchingProducts_ReturnsHighSimilarity() {
        Product p1 = Product.builder()
                .id(1L)
                .title("Apple MacBook Air M2 13-inch 256GB")
                .brand("Apple")
                .modelNumber("MLXW3HN/A")
                .build();

        Product p2 = Product.builder()
                .id(2L)
                .title("Apple MacBook Air M2 Laptop 256GB Midnight")
                .brand("Apple")
                .modelNumber("MLXW3HN/A")
                .build();

        double score = matchingService.calculateSimilarityScore(p1, p2);
        assertTrue(score >= 0.85, "Similarity score for identical model and brand should exceed 0.85");
    }

    @Test
    void findTopKMatches_UsingPriorityQueue_ReturnsRankedMatches() {
        Product target = Product.builder()
                .id(1L)
                .title("Dell XPS 13 9315 Laptop Intel i5")
                .brand("Dell")
                .modelNumber("XPS9315-i5-16-512")
                .build();

        Product exactSameModel = Product.builder()
                .id(2L)
                .title("Dell XPS 13 9315 Ultrabook")
                .brand("Dell")
                .modelNumber("XPS9315-i5-16-512")
                .build();

        Product differentBrandSameCategory = Product.builder()
                .id(3L)
                .title("Apple MacBook Air M2")
                .brand("Apple")
                .modelNumber("MLXW3HN/A")
                .build();

        List<ProductMatchingService.MatchCandidate> topMatches = matchingService.findTopKMatches(
                target,
                List.of(exactSameModel, differentBrandSameCategory),
                1
        );

        assertEquals(1, topMatches.size());
        assertEquals(2L, topMatches.get(0).product().getId());
        assertTrue(topMatches.get(0).similarityScore() > 0.8);
    }
}
