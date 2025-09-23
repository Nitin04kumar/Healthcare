package org.healthcare.service.impl;

import lombok.RequiredArgsConstructor;
import org.healthcare.dto.NotificationDto;
import org.healthcare.models.Notification;
import org.healthcare.models.User;
import org.healthcare.repository.NotificationRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.annotation.Transactional;
import org.healthcare.service.NotificationService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    public void createNotification(User user, String message) {
        Notification notification = Notification.builder()
                .user(user)
                .message(message)
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }

    @Override
    public List<NotificationDto> getUnreadNotificationsForUser(User user) {
        return notificationRepository.findByUserAndIsReadFalseOrderByIdDesc(user)
                .stream()
                .map(NotificationDto::fromEntity)
                .collect(Collectors.toList());
    }

    // --- ADD THIS NEW METHOD IMPLEMENTATION ---
    @Override
    @Transactional
    public NotificationDto markAsRead(Long notificationId, User currentUser) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found."));

        // Security check: ensure the user owns this notification
        if (!notification.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You do not have permission to access this notification.");
        }

        notification.setIsRead(true);
        Notification updatedNotification = notificationRepository.save(notification);
        return NotificationDto.fromEntity(updatedNotification);
    }

    // --- ADD THIS NEW METHOD IMPLEMENTATION ---
    @Override
    @Transactional
    public List<NotificationDto> markAllAsRead(User currentUser) {
        List<Notification> unreadNotifications = notificationRepository.findByUserAndIsReadFalseOrderByIdDesc(currentUser);

        if (unreadNotifications.isEmpty()) {
            return List.of(); // Return an empty list if there's nothing to do
        }

        for (Notification notification : unreadNotifications) {
            notification.setIsRead(true);
        }

        List<Notification> updatedNotifications = notificationRepository.saveAll(unreadNotifications);

        return updatedNotifications.stream()
                .map(NotificationDto::fromEntity)
                .collect(Collectors.toList());
    }
}