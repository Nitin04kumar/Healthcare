package org.healthcare.service;


import org.healthcare.dto.NotificationDto;
import org.healthcare.models.User;

import java.util.List;

public interface NotificationService {
    void createNotification(User user, String message);
    List<NotificationDto> getUnreadNotificationsForUser(User user);
    NotificationDto markAsRead(Long notificationId, User currentUser);
    List<NotificationDto> markAllAsRead(User currentUser);
}