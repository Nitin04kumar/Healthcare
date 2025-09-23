package org.healthcare.dto;

import lombok.Builder;
import lombok.Data;
import org.healthcare.models.Patient;

import java.time.LocalDate;

@Data
@Builder
public class PatientProfileDto {
    private Long id; // Patient's profile ID
    private String name;
    private String email;
    private int age;
    private LocalDate dob;
    private String bloodGroup;
    private long phoneNumber;
    private String address;
    private Patient.Gender gender;

    public static PatientProfileDto fromEntity(Patient patient) {
        return PatientProfileDto.builder()
                .id(patient.getId())
                .name(patient.getName())
                .email(patient.getUser().getEmail())
                .age(patient.getAge())
                .dob(patient.getDob())
                .bloodGroup(patient.getBloodGroup())
                .phoneNumber(patient.getPhoneNumber())
                .address(patient.getAddress())
                .gender(patient.getGender())
                .build();
    }
}
