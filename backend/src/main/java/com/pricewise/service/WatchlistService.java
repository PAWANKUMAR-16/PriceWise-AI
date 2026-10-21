package com.pricewise.service;

import com.pricewise.domain.dto.WatchlistRequest;
import com.pricewise.domain.dto.WatchlistResponse;
import com.pricewise.domain.entity.Offer;
import com.pricewise.domain.entity.Product;
import com.pricewise.domain.entity.User;
import com.pricewise.domain.entity.Watchlist;
import com.pricewise.domain.repository.OfferRepository;
import com.pricewise.domain.repository.ProductRepository;
import com.pricewise.domain.repository.UserRepository;
import com.pricewise.domain.repository.WatchlistRepository;
import com.pricewise.exception.BadRequestException;
import com.pricewise.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class WatchlistService {

    private final WatchlistRepository watchlistRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OfferRepository offerRepository;

    @Transactional(readOnly = true)
    public List<WatchlistResponse> getUserWatchlist(Long userId) {
        return watchlistRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public WatchlistResponse addToWatchlist(Long userId, WatchlistRequest request) {
        if (watchlistRepository.existsByUserIdAndProductId(userId, request.productId())) {
            throw new BadRequestException("Product is already in user's watchlist");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.productId()));

        Watchlist watchlist = Watchlist.builder()
                .user(user)
                .product(product)
                .targetPrice(request.targetPrice())
                .build();

        Watchlist saved = watchlistRepository.save(watchlist);
        log.info("Product {} added to watchlist for user {}", product.getId(), user.getId());
        return mapToResponse(saved);
    }

    @Transactional
    public void removeFromWatchlist(Long userId, Long watchlistId) {
        Watchlist watchlist = watchlistRepository.findByUserIdAndId(userId, watchlistId)
                .orElseThrow(() -> new ResourceNotFoundException("Watchlist item", "id", watchlistId));
        watchlistRepository.delete(watchlist);
        log.info("Watchlist item {} removed for user {}", watchlistId, userId);
    }

    private WatchlistResponse mapToResponse(Watchlist w) {
        List<Offer> offers = offerRepository.findCurrentOffersByProductId(w.getProduct().getId());
        BigDecimal currentLowest = offers.isEmpty() ? null :
                offers.get(0).getPrice().add(offers.get(0).getShippingCost());

        return WatchlistResponse.builder()
                .id(w.getId())
                .productId(w.getProduct().getId())
                .productTitle(w.getProduct().getTitle())
                .productBrand(w.getProduct().getBrand())
                .productCategory(w.getProduct().getCategory())
                .currentLowestPrice(currentLowest)
                .targetPrice(w.getTargetPrice())
                .createdAt(w.getCreatedAt())
                .build();
    }
}
