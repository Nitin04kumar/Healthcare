package org.healthcare.dto.availability;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateAvailabilityDto {
    @NotNull(message = "Date is required")
    @FutureOrPresent(message = "Date cannot be in the past")
    private LocalDate date;

    @NotBlank(message = "Time slot is required")
    private String timeSlot;

    @NotNull(message = "Availability status is required")
    private Boolean isAvailable;
}