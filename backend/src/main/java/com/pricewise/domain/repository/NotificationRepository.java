package com.pricewise.domain.repository;

import com.pricewise.domain.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Notification> findByUserIdAndId(Long userId, Long id);
    long countByUserIdAndReadAtIsNull(Long userId);
}
