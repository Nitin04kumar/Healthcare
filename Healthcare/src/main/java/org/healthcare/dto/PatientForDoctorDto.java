package org.healthcare.dto;

import lombok.Builder;
import lombok.Data;
import org.healthcare.models.Patient;

@Data
@Builder
public class PatientForDoctorDto {
    private Long patientId;
    private String name;
    private int age;
    private Patient.Gender gender;

    public static PatientForDoctorDto fromEntity(Patient patient) {
        return PatientForDoctorDto.builder()
                .patientId(patient.getId())
                .name(patient.getName())
                .age(patient.getAge())
                .gender(patient.getGender())
                .build();
    }
}