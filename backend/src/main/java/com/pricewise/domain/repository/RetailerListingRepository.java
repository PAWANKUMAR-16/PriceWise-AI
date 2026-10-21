package com.pricewise.domain.repository;

import com.pricewise.domain.entity.RetailerListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RetailerListingRepository extends JpaRepository<RetailerListing, Long> {

    List<RetailerListing> findByProductId(Long productId);

    Optional<RetailerListing> findByProductUrl(String productUrl);

    @Query("SELECT rl FROM RetailerListing rl JOIN rl.retailer r WHERE r.code = :retailerCode AND rl.externalProductId = :externalProductId")
    Optional<RetailerListing> findByRetailerCodeAndExternalProductId(
            @Param("retailerCode") String retailerCode,
            @Param("externalProductId") String externalProductId
    );

    long countByRetailerId(Long retailerId);
}
