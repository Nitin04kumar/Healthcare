package org.healthcare.dto.availability;

import lombok.Builder;
import lombok.Data;
import org.healthcare.models.DoctorAvailability;

import java.time.LocalDate;

/**
 * DTO for representing a doctor's availability slot.
 * Used to transfer availability data between the backend and frontend.
 */
@Data
@Builder
public class AvailabilityDto {
    private Long availabilityId;
    private Long doctorId;
    private LocalDate date;
    private String timeSlot;
    private Boolean isAvailable;

    /**
     * A static factory method to create an AvailabilityDto from a DoctorAvailability entity.
     * This is a common pattern to keep conversion logic clean.
     * @param entity The DoctorAvailability entity from the database.
     * @return A new AvailabilityDto object.
     */
    public static AvailabilityDto fromEntity(DoctorAvailability entity) {
        return AvailabilityDto.builder()
                .availabilityId(entity.getAvailabilityId())
                .doctorId(entity.getDoctor().getId())
                .date(entity.getDate())
                .timeSlot(entity.getTimeSlot())
                .isAvailable(entity.getIsAvailable())
                .build();
    }
}