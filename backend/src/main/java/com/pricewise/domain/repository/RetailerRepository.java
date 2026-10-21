package com.pricewise.domain.repository;

import com.pricewise.domain.entity.Retailer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RetailerRepository extends JpaRepository<Retailer, Long> {
    Optional<Retailer> findByCode(String code);
    List<Retailer> findByIsActiveTrue();
}
