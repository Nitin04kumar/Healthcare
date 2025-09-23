package org.healthcare.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateDoctorProfileDto {
    @NotBlank(message = "Name cannot be blank")
    private String name;

    @NotBlank(message = "Specialization cannot be blank")
    private String specialization;

    private int exp;

    @NotBlank(message = "Qualification cannot be blank")
    private String qualification;
}
