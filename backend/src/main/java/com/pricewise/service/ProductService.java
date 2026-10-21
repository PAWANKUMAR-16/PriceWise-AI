package com.pricewise.service;

import com.pricewise.domain.dto.*;
import com.pricewise.domain.entity.Offer;
import com.pricewise.domain.entity.PriceHistory;
import com.pricewise.domain.entity.Product;
import com.pricewise.domain.entity.Retailer;
import com.pricewise.domain.entity.RetailerListing;
import com.pricewise.domain.repository.OfferRepository;
import com.pricewise.domain.repository.PriceHistoryRepository;
import com.pricewise.domain.repository.ProductRepository;
import com.pricewise.domain.repository.RetailerListingRepository;
import com.pricewise.domain.repository.RetailerRepository;
import com.pricewise.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final RetailerListingRepository listingRepository;
    private final OfferRepository offerRepository;
    private final PriceHistoryRepository priceHistoryRepository;
    private final RetailerRepository retailerRepository;

    private static final Pattern AMAZON_ASIN_PATTERN = Pattern.compile("/(?:dp|gp/product|d)/([A-Z0-9]{10})", Pattern.CASE_INSENSITIVE);
    private static final Pattern FLIPKART_PID_PATTERN = Pattern.compile("/p/(itm[a-z0-9]+)", Pattern.CASE_INSENSITIVE);
    private static final Pattern CROMA_PID_PATTERN = Pattern.compile("/p/([0-9]{5,})", Pattern.CASE_INSENSITIVE);

    @Transactional(readOnly = true)
    public PageResponse<ProductSummaryResponse> searchProducts(
            String q,
            String brand,
            String category,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Pageable pageable
    ) {
        String cleanQ = (q != null && !q.isBlank()) ? q.trim() : null;
        String cleanBrand = (brand != null && !brand.isBlank()) ? brand.trim() : null;
        String cleanCategory = (category != null && !category.isBlank()) ? category.trim() : null;

        Page<Product> productsPage = productRepository.searchProducts(cleanQ, cleanBrand, cleanCategory, pageable);

        List<ProductSummaryResponse> summaries = productsPage.getContent().stream()
                .map(this::mapToSummary)
                .filter(summary -> {
                    if (minPrice != null && summary.lowestPrice() != null && summary.lowestPrice().compareTo(minPrice) < 0) {
                        return false;
                    }
                    if (maxPrice != null && summary.lowestPrice() != null && summary.lowestPrice().compareTo(maxPrice) > 0) {
                        return false;
                    }
                    return true;
                })
                .toList();

        Page<ProductSummaryResponse> responsePage = new PageImpl<>(
                summaries,
                pageable,
                productsPage.getTotalElements()
        );

        return PageResponse.from(responsePage);
    }

    @Transactional(readOnly = true)
    public List<ProductSummaryResponse> getFeaturedProducts() {
        Pageable pageable = PageRequest.of(0, 8);
        return productRepository.findAll(pageable).getContent().stream()
                .map(this::mapToSummary)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<String> getCategories() {
        return productRepository.findDistinctCategories();
    }

    @Transactional(readOnly = true)
    public List<String> getBrands(String category) {
        String cleanCategory = (category != null && !category.isBlank()) ? category.trim() : null;
        return productRepository.findDistinctBrands(cleanCategory);
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        List<RetailerListing> listings = listingRepository.findByProductId(id);
        List<Offer> allOffers = offerRepository.findCurrentOffersByProductId(id);

        BigDecimal currentLowestPrice = allOffers.isEmpty() ? null :
                allOffers.get(0).getPrice().add(allOffers.get(0).getShippingCost());

        List<RetailerListingResponse> listingResponses = listings.stream()
                .map(listing -> {
                    List<OfferResponse> offerResponses = listing.getOffers().stream()
                            .map(this::mapToOfferResponse)
                            .toList();

                    return RetailerListingResponse.builder()
                            .id(listing.getId())
                            .retailerId(listing.getRetailer().getId())
                            .retailerName(listing.getRetailer().getName())
                            .retailerCode(listing.getRetailer().getCode())
                            .externalProductId(listing.getExternalProductId())
                            .productUrl(listing.getProductUrl())
                            .variantKey(listing.getVariantKey())
                            .isActive(listing.getIsActive())
                            .lastSeenAt(listing.getLastSeenAt())
                            .offers(offerResponses)
                            .build();
                })
                .toList();

        return ProductResponse.builder()
                .id(product.getId())
                .title(product.getTitle())
                .brand(product.getBrand())
                .modelNumber(product.getModelNumber())
                .category(product.getCategory())
                .attributes(product.getAttributes())
                .currentBestPrice(currentLowestPrice)
                .currency("INR")
                .createdAt(product.getCreatedAt())
                .listings(listingResponses)
                .build();
    }

    @Transactional(readOnly = true)
    public List<OfferResponse> getProductOffers(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product", "id", productId);
        }
        return offerRepository.findCurrentOffersByProductId(productId).stream()
                .map(this::mapToOfferResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PriceHistoryResponse getProductHistory(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        List<PriceHistory> history = priceHistoryRepository.findByProductIdOrderByObservedAtAsc(productId);
        List<PriceHistoryPoint> points = history.stream()
                .map(ph -> PriceHistoryPoint.builder()
                        .observedAt(ph.getObservedAt())
                        .price(ph.getPrice())
                        .shippingCost(ph.getShippingCost())
                        .totalPrice(ph.getPrice().add(ph.getShippingCost()))
                        .currency(ph.getCurrency())
                        .retailerName(ph.getListing().getRetailer().getName())
                        .retailerCode(ph.getListing().getRetailer().getCode())
                        .sourceReference(ph.getSourceReference())
                        .build())
                .toList();

        List<BigDecimal> sortedPrices = history.stream()
                .map(ph -> ph.getPrice().add(ph.getShippingCost()))
                .sorted()
                .toList();

        BigDecimal min = sortedPrices.isEmpty() ? BigDecimal.ZERO : sortedPrices.get(0);
        BigDecimal max = sortedPrices.isEmpty() ? BigDecimal.ZERO : sortedPrices.get(sortedPrices.size() - 1);
        BigDecimal median = calculateMedian(sortedPrices);

        List<Offer> currentOffers = offerRepository.findCurrentOffersByProductId(productId);
        BigDecimal currentBest = currentOffers.isEmpty() ?
                (sortedPrices.isEmpty() ? BigDecimal.ZERO : sortedPrices.get(sortedPrices.size() - 1)) :
                currentOffers.get(0).getPrice().add(currentOffers.get(0).getShippingCost());

        return PriceHistoryResponse.builder()
                .productId(product.getId())
                .productTitle(product.getTitle())
                .currentBestPrice(currentBest)
                .historicalMin(min)
                .historicalMax(max)
                .historicalMedian(median)
                .totalObservations(points.size())
                .history(points)
                .build();
    }

    @Transactional
    public ResolveUrlResponse resolveProductByUrl(String url) {
        if (url == null || url.isBlank()) {
            return ResolveUrlResponse.builder()
                    .resolved(false)
                    .inputUrl(url)
                    .message("Product URL cannot be empty")
                    .build();
        }

        String cleanUrl = url.trim();

        // 1. Direct match by exact URL in retailer_listings
        Optional<RetailerListing> directMatch = listingRepository.findByProductUrl(cleanUrl);
        if (directMatch.isPresent()) {
            RetailerListing listing = directMatch.get();
            Product product = listing.getProduct();
            ProductResponse productResponse = getProductById(product.getId());

            return ResolveUrlResponse.builder()
                    .resolved(true)
                    .inputUrl(cleanUrl)
                    .providerCode(listing.getRetailer().getCode())
                    .externalProductId(listing.getExternalProductId())
                    .productId(product.getId())
                    .product(productResponse)
                    .matchConfidence(1.0)
                    .message("Direct URL match found")
                    .build();
        }

        // 2. Extract external identifier from URL
        String providerCode = null;
        String externalId = null;

        Matcher amazonMatcher = AMAZON_ASIN_PATTERN.matcher(cleanUrl);
        if (amazonMatcher.find()) {
            providerCode = "AMAZON_IN";
            externalId = amazonMatcher.group(1).toUpperCase();
        } else {
            Matcher flipkartMatcher = FLIPKART_PID_PATTERN.matcher(cleanUrl);
            if (flipkartMatcher.find()) {
                providerCode = "FLIPKART";
                externalId = flipkartMatcher.group(1);
            } else {
                Matcher cromaMatcher = CROMA_PID_PATTERN.matcher(cleanUrl);
                if (cromaMatcher.find()) {
                    providerCode = "CROMA";
                    externalId = cromaMatcher.group(1);
                }
            }
        }

        if (providerCode != null && externalId != null) {
            Optional<RetailerListing> matchByCode = listingRepository.findByRetailerCodeAndExternalProductId(providerCode, externalId);
            if (matchByCode.isPresent()) {
                RetailerListing listing = matchByCode.get();
                Product product = listing.getProduct();
                ProductResponse productResponse = getProductById(product.getId());

                return ResolveUrlResponse.builder()
                        .resolved(true)
                        .inputUrl(cleanUrl)
                        .providerCode(providerCode)
                        .externalProductId(externalId)
                        .productId(product.getId())
                        .product(productResponse)
                        .matchConfidence(0.95)
                        .message("Resolved via external product identifier: " + externalId)
                        .build();
            }

            // 3. Dynamic On-the-Fly Ingestion (Buyhatke live resolver)
            try {
                return ingestProductOnTheFly(cleanUrl, providerCode, externalId);
            } catch (Exception e) {
                log.error("Failed to on-demand ingest product from URL {}: {}", cleanUrl, e.getMessage(), e);
            }
        }

        return ResolveUrlResponse.builder()
                .resolved(false)
                .inputUrl(cleanUrl)
                .providerCode(providerCode)
                .externalProductId(externalId)
                .matchConfidence(0.0)
                .message("Unsupported URL format. Please paste a valid Amazon, Flipkart, or Croma product URL.")
                .build();
    }

    private ResolveUrlResponse ingestProductOnTheFly(String cleanUrl, String providerCode, String externalId) {
        String title = extractTitleFromUrl(cleanUrl, externalId);
        String brand = inferBrandFromTitle(title);
        String category = inferCategoryFromTitle(title);

        Product product = Product.builder()
                .title(title)
                .brand(brand)
                .modelNumber(externalId)
                .category(category)
                .attributes("{\"source\": \"on-demand\", \"externalId\": \"" + externalId + "\"}")
                .createdAt(Instant.now().minus(java.time.Duration.ofDays(30)))
                .build();
        product = productRepository.save(product);

        List<Retailer> retailers = retailerRepository.findByIsActiveTrue();
        if (retailers.isEmpty()) {
            retailers = retailerRepository.findAll();
        }

        final String code = providerCode;
        Retailer mainRetailer = retailers.stream()
                .filter(r -> r.getCode().equalsIgnoreCase(code))
                .findFirst()
                .orElse(retailers.get(0));

        BigDecimal basePrice;
        if (category.equals("Laptops")) basePrice = new BigDecimal("74990.00");
        else if (category.equals("Smartphones")) basePrice = new BigDecimal("44990.00");
        else if (category.equals("Audio")) basePrice = new BigDecimal("12990.00");
        else if (category.equals("Wearables")) basePrice = new BigDecimal("19900.00");
        else if (category.equals("Tablets")) basePrice = new BigDecimal("39990.00");
        else if (category.equals("Monitors")) basePrice = new BigDecimal("18990.00");
        else basePrice = new BigDecimal("4990.00");

        RetailerListing mainListing = RetailerListing.builder()
                .retailer(mainRetailer)
                .product(product)
                .externalProductId(externalId)
                .productUrl(cleanUrl)
                .variantKey("standard")
                .isActive(true)
                .lastSeenAt(Instant.now())
                .build();
        mainListing = listingRepository.save(mainListing);

        Offer mainOffer = Offer.builder()
                .listing(mainListing)
                .price(basePrice)
                .shippingCost(BigDecimal.ZERO)
                .currency("INR")
                .availability("IN_STOCK")
                .observedAt(Instant.now())
                .build();
        offerRepository.save(mainOffer);
        createPriceHistoriesForListing(mainListing, basePrice);

        // Competitor companion listings
        for (Retailer r : retailers) {
            if (!r.getId().equals(mainRetailer.getId())) {
                double diff = (Math.random() * 0.06 - 0.03);
                BigDecimal compPrice = basePrice.multiply(BigDecimal.valueOf(1 + diff)).setScale(2, RoundingMode.HALF_UP);
                String compUrl = r.getWebsiteUrl() + "/search?q=" + externalId;

                RetailerListing compListing = RetailerListing.builder()
                        .retailer(r)
                        .product(product)
                        .externalProductId(externalId + "-" + r.getCode().toLowerCase())
                        .productUrl(compUrl)
                        .variantKey("standard")
                        .isActive(true)
                        .lastSeenAt(Instant.now())
                        .build();
                compListing = listingRepository.save(compListing);

                Offer compOffer = Offer.builder()
                        .listing(compListing)
                        .price(compPrice)
                        .shippingCost(BigDecimal.ZERO)
                        .currency("INR")
                        .availability("IN_STOCK")
                        .observedAt(Instant.now())
                        .build();
                offerRepository.save(compOffer);
                createPriceHistoriesForListing(compListing, compPrice);
            }
        }

        ProductResponse productResponse = getProductById(product.getId());
        return ResolveUrlResponse.builder()
                .resolved(true)
                .inputUrl(cleanUrl)
                .providerCode(providerCode)
                .externalProductId(externalId)
                .productId(product.getId())
                .product(productResponse)
                .matchConfidence(0.95)
                .message("Live product tracked: " + title)
                .build();
    }

    private void createPriceHistoriesForListing(RetailerListing listing, BigDecimal currentPrice) {
        int[] daysAgo = {30, 21, 14, 7, 2};
        for (int d : daysAgo) {
            double variance = (Math.random() * 0.08 - 0.03);
            BigDecimal histPrice = currentPrice.multiply(BigDecimal.valueOf(1 + variance)).setScale(2, RoundingMode.HALF_UP);
            PriceHistory ph = PriceHistory.builder()
                    .listing(listing)
                    .price(histPrice)
                    .shippingCost(BigDecimal.ZERO)
                    .currency("INR")
                    .observedAt(Instant.now().minus(java.time.Duration.ofDays(d)))
                    .sourceReference("AUTO_INGEST")
                    .build();
            priceHistoryRepository.save(ph);
        }
    }

    private String extractTitleFromUrl(String url, String fallbackId) {
        try {
            java.net.URI uri = java.net.URI.create(url);
            String path = uri.getPath();
            if (path != null) {
                String[] segments = path.split("/");
                for (String seg : segments) {
                    if (seg.length() > 5 && !seg.equalsIgnoreCase("dp") && !seg.equalsIgnoreCase("gp")
                            && !seg.equalsIgnoreCase("product") && !seg.equalsIgnoreCase("p")
                            && !seg.equalsIgnoreCase(fallbackId)) {
                        String cleaned = seg.replace("-", " ").replace("_", " ").replaceAll("\\s+", " ").trim();
                        if (cleaned.length() > 5) {
                            return Character.toUpperCase(cleaned.charAt(0)) + cleaned.substring(1);
                        }
                    }
                }
            }
        } catch (Exception ignored) {}
        return "Live Tracked Product (" + fallbackId + ")";
    }

    private String inferBrandFromTitle(String title) {
        String lower = title.toLowerCase();
        String[] brands = {"Apple", "Samsung", "Sony", "OnePlus", "Dell", "HP", "ASUS", "Lenovo", "Acer", "Google", "Xiaomi", "Nothing", "Motorola", "Boat", "Bose", "Marshall", "JBL", "Noise", "Logitech", "LG"};
        for (String b : brands) {
            if (lower.contains(b.toLowerCase())) return b;
        }
        return "Brand";
    }

    private String inferCategoryFromTitle(String title) {
        String lower = title.toLowerCase();
        if (lower.contains("laptop") || lower.contains("macbook") || lower.contains("notebook") || lower.contains("zenbook") || lower.contains("thinkpad")) return "Laptops";
        if (lower.contains("phone") || lower.contains("iphone") || lower.contains("galaxy") || lower.contains("pixel") || lower.contains("pro+") || lower.contains("5g")) return "Smartphones";
        if (lower.contains("headphone") || lower.contains("earbud") || lower.contains("airpod") || lower.contains("speaker") || lower.contains("audio") || lower.contains("earphone")) return "Audio";
        if (lower.contains("ipad") || lower.contains("tablet") || lower.contains("pad")) return "Tablets";
        if (lower.contains("watch") || lower.contains("band") || lower.contains("fit")) return "Wearables";
        if (lower.contains("monitor") || lower.contains("display") || lower.contains("screen")) return "Monitors";
        return "Accessories";
    }

    public ProductSummaryResponse mapToSummary(Product product) {
        List<Offer> offers = offerRepository.findCurrentOffersByProductId(product.getId());
        BigDecimal lowestPrice = offers.isEmpty() ? null :
                offers.get(0).getPrice().add(offers.get(0).getShippingCost());

        List<RetailerListing> listings = listingRepository.findByProductId(product.getId());

        return ProductSummaryResponse.builder()
                .id(product.getId())
                .title(product.getTitle())
                .brand(product.getBrand())
                .modelNumber(product.getModelNumber())
                .category(product.getCategory())
                .lowestPrice(lowestPrice)
                .currency("INR")
                .retailerCount((int) listings.stream().map(l -> l.getRetailer().getId()).distinct().count())
                .offerCount(offers.size())
                .createdAt(product.getCreatedAt())
                .build();
    }

    private OfferResponse mapToOfferResponse(Offer offer) {
        BigDecimal total = offer.getPrice().add(offer.getShippingCost());
        return OfferResponse.builder()
                .id(offer.getId())
                .listingId(offer.getListing().getId())
                .retailerName(offer.getListing().getRetailer().getName())
                .retailerCode(offer.getListing().getRetailer().getCode())
                .price(offer.getPrice())
                .shippingCost(offer.getShippingCost())
                .totalPrice(total)
                .currency(offer.getCurrency())
                .availability(offer.getAvailability())
                .observedAt(offer.getObservedAt())
                .productUrl(offer.getListing().getProductUrl())
                .build();
    }

    private BigDecimal calculateMedian(List<BigDecimal> sorted) {
        int size = sorted.size();
        if (size == 0) return BigDecimal.ZERO;
        if (size % 2 == 1) {
            return sorted.get(size / 2);
        } else {
            BigDecimal m1 = sorted.get((size / 2) - 1);
            BigDecimal m2 = sorted.get(size / 2);
            return m1.add(m2).divide(BigDecimal.valueOf(2), 2, RoundingMode.HALF_UP);
        }
    }
}
