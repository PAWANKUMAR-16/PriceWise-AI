package com.pricewise.domain.repository;

import com.pricewise.domain.entity.AlertStatus;
import com.pricewise.domain.entity.PriceAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PriceAlertRepository extends JpaRepository<PriceAlert, Long> {
    List<PriceAlert> findByUserId(Long userId);
    List<PriceAlert> findByStatus(AlertStatus status);
    Optional<PriceAlert> findByUserIdAndId(Long userId, Long id);
    long countByStatus(AlertStatus status);

    @Query("SELECT pa FROM PriceAlert pa JOIN FETCH pa.product p JOIN FETCH pa.user u WHERE pa.status = :status")
    List<PriceAlert> findAllWithProductAndUserByStatus(@Param("status") AlertStatus status);
}
