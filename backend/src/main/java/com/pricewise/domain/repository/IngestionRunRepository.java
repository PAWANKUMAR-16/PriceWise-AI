package com.pricewise.domain.repository;

import com.pricewise.domain.entity.IngestionRun;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IngestionRunRepository extends JpaRepository<IngestionRun, Long> {
    List<IngestionRun> findTop10ByOrderByStartedAtDesc();
    List<IngestionRun> findByProviderCodeOrderByStartedAtDesc(String providerCode);
    Optional<IngestionRun> findTopByProviderCodeOrderByStartedAtDesc(String providerCode);
}
