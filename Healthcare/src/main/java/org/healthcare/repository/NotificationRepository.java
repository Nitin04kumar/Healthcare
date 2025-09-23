package org.healthcare.repository;

import org.healthcare.models.Notification;
import org.healthcare.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    // Finds all unread notifications for a user, showing the newest first
    List<Notification> findByUserAndIsReadFalseOrderByIdDesc(User user);
}