package org.healthcare.dto;

import lombok.Builder;
import lombok.Data;
import org.healthcare.models.Notification;


@Data
@Builder
public class NotificationDto {
    private Long id;
    private String message;
    private Boolean isRead;

    public static NotificationDto fromEntity(Notification notification) {
        return NotificationDto.builder()
                .id(notification.getId())
                .message(notification.getMessage())
                .isRead(notification.getIsRead())
                .build();
    }
}