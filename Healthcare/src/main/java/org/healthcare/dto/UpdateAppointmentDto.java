package org.healthcare.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateAppointmentDto {
    @NotBlank(message = "Reason cannot be blank")
    private String reason;
}