package com.pricewise.domain.repository;

import com.pricewise.domain.entity.Offer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface OfferRepository extends JpaRepository<Offer, Long> {

    List<Offer> findByListingIdOrderByObservedAtDesc(Long listingId);

    @Query("SELECT o FROM Offer o JOIN o.listing rl WHERE rl.product.id = :productId ORDER BY (o.price + o.shippingCost) ASC")
    List<Offer> findCurrentOffersByProductId(@Param("productId") Long productId);

    @Query("SELECT MIN(o.price + o.shippingCost) FROM Offer o JOIN o.listing rl WHERE rl.product.id = :productId")
    Optional<BigDecimal> findLowestTotalPriceByProductId(@Param("productId") Long productId);

    @Query("SELECT o FROM Offer o JOIN o.listing rl WHERE rl.product.id = :productId ORDER BY (o.price + o.shippingCost) ASC LIMIT 1")
    Optional<Offer> findLowestOfferByProductId(@Param("productId") Long productId);
}
