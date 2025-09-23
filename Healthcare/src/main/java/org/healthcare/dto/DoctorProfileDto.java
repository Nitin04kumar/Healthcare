package org.healthcare.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.healthcare.models.Doctor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorProfileDto {
    private Long id; // Doctor's profile ID
    private String name;
    private String email;
    private String specialization;
    private int exp;
    private String qualification;
    private float rating;

    public static DoctorProfileDto fromEntity(Doctor doctor) {
        return DoctorProfileDto.builder()
                .id(doctor.getId())
                .name(doctor.getName())
                .email(doctor.getUser().getEmail()) // Get email from the associated User
                .specialization(doctor.getSpecialization())
                .exp(doctor.getExp())
                .qualification(doctor.getQualification())
                .rating(doctor.getRating())
                .build();
    }
}
