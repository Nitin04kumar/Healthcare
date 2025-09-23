package org.healthcare.controller;

import lombok.RequiredArgsConstructor;
import org.healthcare.dto.NotificationDto;
import org.healthcare.models.User;
import org.healthcare.response.ApiResponse;
import org.healthcare.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationDto>>> getMyNotifications(@AuthenticationPrincipal User currentUser) {
        List<NotificationDto> notifications = notificationService.getUnreadNotificationsForUser(currentUser);
        return ResponseEntity.ok(ApiResponse.success(notifications));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<NotificationDto>> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        NotificationDto notification = notificationService.markAsRead(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(notification));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<List<NotificationDto>>> markAllAsRead(@AuthenticationPrincipal User currentUser) {
        List<NotificationDto> notifications = notificationService.markAllAsRead(currentUser);
        return ResponseEntity.ok(ApiResponse.success(notifications));
    }
}