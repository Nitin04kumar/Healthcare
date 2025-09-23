package org.healthcare.dto.availability;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateAvailabilityDto {
    @NotNull(message = "Availability status is required")
    private Boolean isAvailable;
}