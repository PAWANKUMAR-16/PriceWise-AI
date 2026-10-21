package com.pricewise.domain.repository;

import com.pricewise.domain.entity.PriceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface PriceHistoryRepository extends JpaRepository<PriceHistory, Long> {

    List<PriceHistory> findByListingIdOrderByObservedAtAsc(Long listingId);

    @Query("SELECT ph FROM PriceHistory ph JOIN ph.listing rl WHERE rl.product.id = :productId ORDER BY ph.observedAt ASC")
    List<PriceHistory> findByProductIdOrderByObservedAtAsc(@Param("productId") Long productId);

    @Query("SELECT MIN(ph.price + ph.shippingCost) FROM PriceHistory ph JOIN ph.listing rl WHERE rl.product.id = :productId")
    Optional<BigDecimal> findHistoricalMinPrice(@Param("productId") Long productId);

    @Query("SELECT MAX(ph.price + ph.shippingCost) FROM PriceHistory ph JOIN ph.listing rl WHERE rl.product.id = :productId")
    Optional<BigDecimal> findHistoricalMaxPrice(@Param("productId") Long productId);
}
