package com.pricewise.service;

import com.pricewise.domain.dto.NotificationResponse;
import com.pricewise.domain.entity.Notification;
import com.pricewise.domain.entity.User;
import com.pricewise.domain.repository.NotificationRepository;
import com.pricewise.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional(readOnly = true)
    public List<NotificationResponse> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public NotificationResponse markAsRead(Long userId, Long notificationId) {
        Notification notification = notificationRepository.findByUserIdAndId(userId, notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));

        notification.setReadAt(Instant.now());
        Notification saved = notificationRepository.save(notification);
        log.info("Notification {} marked as read for user {}", notificationId, userId);
        return mapToResponse(saved);
    }

    @Transactional
    public Notification createNotification(User user, String type, String payload) {
        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .payload(payload)
                .build();
        return notificationRepository.save(notification);
    }

    private NotificationResponse mapToResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .userId(n.getUser().getId())
                .type(n.getType())
                .payload(n.getPayload())
                .readAt(n.getReadAt())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
