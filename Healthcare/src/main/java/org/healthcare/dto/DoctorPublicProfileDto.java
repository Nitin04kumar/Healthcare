package org.healthcare.dto;

import lombok.Builder;
import lombok.Data;

import org.healthcare.dto.availability.AvailabilityDto;
import org.healthcare.models.Doctor;

import java.util.List;

@Data
@Builder
public class DoctorPublicProfileDto {
    private Long id;
    private String name;
    private String specialization;
    private int exp;
    private String qualification;
    private float rating;
    private List<AvailabilityDto> availability;

    public static DoctorPublicProfileDto fromEntity(Doctor doctor, List<AvailabilityDto> availability) {
        return DoctorPublicProfileDto.builder()
                .id(doctor.getId())
                .name(doctor.getName())
                .specialization(doctor.getSpecialization())
                .exp(doctor.getExp())
                .qualification(doctor.getQualification())
                .rating(doctor.getRating())
                .availability(availability)
                .build();
    }
}