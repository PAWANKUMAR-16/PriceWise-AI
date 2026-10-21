package com.pricewise.adapter;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;

@Component
public class SyntheticDataAdapter implements PriceDataAdapter {

    public static final String PROVIDER_CODE = "SYNTHETIC";

    private final List<AdapterProduct> mockCatalog = List.of(
            AdapterProduct.builder()
                    .externalProductId("SYNTH-001")
                    .title("Apple MacBook Air M2 13.6-inch 8GB 256GB SSD Midnight")
                    .brand("Apple")
                    .modelNumber("MLXW3HN/A")
                    .category("Laptops")
                    .productUrl("https://synthetic-store.example/products/apple-macbook-air-m2")
                    .currentPrice(new BigDecimal("91999.00"))
                    .shippingCost(BigDecimal.ZERO)
                    .currency("INR")
                    .availability("IN_STOCK")
                    .attributes(Map.of("color", "Midnight", "ram", "8GB", "storage", "256GB"))
                    .build(),
            AdapterProduct.builder()
                    .externalProductId("SYNTH-002")
                    .title("Dell XPS 13 9315 Laptop Intel Evo Core i5-1230U 16GB 512GB SSD")
                    .brand("Dell")
                    .modelNumber("XPS9315-i5-16-512")
                    .category("Laptops")
                    .productUrl("https://synthetic-store.example/products/dell-xps-13-9315")
                    .currentPrice(new BigDecimal("108990.00"))
                    .shippingCost(BigDecimal.ZERO)
                    .currency("INR")
                    .availability("IN_STOCK")
                    .attributes(Map.of("color", "Sky Blue", "ram", "16GB", "storage", "512GB"))
                    .build(),
            AdapterProduct.builder()
                    .externalProductId("SYNTH-003")
                    .title("Apple iPhone 15 Pro 128GB Natural Titanium")
                    .brand("Apple")
                    .modelNumber("MTV13HN/A")
                    .category("Smartphones")
                    .productUrl("https://synthetic-store.example/products/iphone-15-pro-128gb")
                    .currentPrice(new BigDecimal("126999.00"))
                    .shippingCost(BigDecimal.ZERO)
                    .currency("INR")
                    .availability("IN_STOCK")
                    .attributes(Map.of("color", "Natural Titanium", "storage", "128GB"))
                    .build(),
            AdapterProduct.builder()
                    .externalProductId("SYNTH-004")
                    .title("Sony WH-1000XM5 Wireless Industry Leading Noise Canceling Headphones")
                    .brand("Sony")
                    .modelNumber("WH1000XM5/B")
                    .category("Audio")
                    .productUrl("https://synthetic-store.example/products/sony-wh-1000xm5")
                    .currentPrice(new BigDecimal("26490.00"))
                    .shippingCost(BigDecimal.ZERO)
                    .currency("INR")
                    .availability("IN_STOCK")
                    .attributes(Map.of("color", "Black", "anc", "true"))
                    .build()
    );

    @Override
    public String getProviderCode() {
        return PROVIDER_CODE;
    }

    @Override
    public List<AdapterProduct> fetchProducts(String query) {
        if (query == null || query.isBlank()) {
            return mockCatalog;
        }
        String lowerQuery = query.toLowerCase().trim();
        return mockCatalog.stream()
                .filter(p -> p.title().toLowerCase().contains(lowerQuery)
                        || p.brand().toLowerCase().contains(lowerQuery)
                        || p.category().toLowerCase().contains(lowerQuery)
                        || (p.modelNumber() != null && p.modelNumber().toLowerCase().contains(lowerQuery)))
                .toList();
    }

    @Override
    public List<AdapterOffer> fetchOffers(String externalProductId) {
        return mockCatalog.stream()
                .filter(p -> p.externalProductId().equalsIgnoreCase(externalProductId))
                .findFirst()
                .map(p -> List.of(
                        AdapterOffer.builder()
                                .externalProductId(p.externalProductId())
                                .providerCode(PROVIDER_CODE)
                                .price(p.currentPrice())
                                .shippingCost(p.shippingCost())
                                .currency(p.currency())
                                .availability(p.availability())
                                .productUrl(p.productUrl())
                                .observedAt(Instant.now())
                                .build()
                ))
                .orElse(Collections.emptyList());
    }
}
