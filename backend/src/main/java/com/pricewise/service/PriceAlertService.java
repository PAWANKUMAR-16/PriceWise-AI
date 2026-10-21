package com.pricewise.service;

import com.pricewise.domain.dto.PriceAlertRequest;
import com.pricewise.domain.dto.PriceAlertResponse;
import com.pricewise.domain.dto.PriceAlertUpdateStatusRequest;
import com.pricewise.domain.entity.AlertStatus;
import com.pricewise.domain.entity.Offer;
import com.pricewise.domain.entity.PriceAlert;
import com.pricewise.domain.entity.Product;
import com.pricewise.domain.entity.User;
import com.pricewise.domain.repository.OfferRepository;
import com.pricewise.domain.repository.PriceAlertRepository;
import com.pricewise.domain.repository.ProductRepository;
import com.pricewise.domain.repository.UserRepository;
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
public class PriceAlertService {

    private final PriceAlertRepository priceAlertRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OfferRepository offerRepository;

    @Transactional(readOnly = true)
    public List<PriceAlertResponse> getUserAlerts(Long userId) {
        return priceAlertRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public PriceAlertResponse createAlert(Long userId, PriceAlertRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.productId()));

        PriceAlert alert = PriceAlert.builder()
                .user(user)
                .product(product)
                .targetPrice(request.targetPrice())
                .status(AlertStatus.ACTIVE)
                .build();

        PriceAlert saved = priceAlertRepository.save(alert);
        log.info("Price alert created for user {} on product {} with targetPrice={}", user.getId(), product.getId(), request.targetPrice());
        return mapToResponse(saved);
    }

    @Transactional
    public PriceAlertResponse updateAlert(Long userId, Long alertId, PriceAlertUpdateStatusRequest request) {
        PriceAlert alert = priceAlertRepository.findByUserIdAndId(userId, alertId)
                .orElseThrow(() -> new ResourceNotFoundException("PriceAlert", "id", alertId));

        if (request.status() != null) {
            alert.setStatus(request.status());
        }
        if (request.targetPrice() != null) {
            alert.setTargetPrice(request.targetPrice());
        }

        PriceAlert updated = priceAlertRepository.save(alert);
        log.info("Price alert {} updated: status={}, targetPrice={}", alertId, updated.getStatus(), updated.getTargetPrice());
        return mapToResponse(updated);
    }

    private PriceAlertResponse mapToResponse(PriceAlert alert) {
        List<Offer> offers = offerRepository.findCurrentOffersByProductId(alert.getProduct().getId());
        BigDecimal currentPrice = offers.isEmpty() ? null :
                offers.get(0).getPrice().add(offers.get(0).getShippingCost());

        return PriceAlertResponse.builder()
                .id(alert.getId())
                .productId(alert.getProduct().getId())
                .productTitle(alert.getProduct().getTitle())
                .productBrand(alert.getProduct().getBrand())
                .targetPrice(alert.getTargetPrice())
                .currentPrice(currentPrice)
                .status(alert.getStatus())
                .lastTriggeredAt(alert.getLastTriggeredAt())
                .createdAt(alert.getCreatedAt())
                .build();
    }
}
