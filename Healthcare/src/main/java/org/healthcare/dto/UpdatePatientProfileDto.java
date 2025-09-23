package org.healthcare.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.healthcare.models.Patient;

@Data
public class UpdatePatientProfileDto {

    @NotBlank(message = "Name cannot be blank")
    private String name;

    private int age;

    @NotBlank(message = "Blood group cannot be blank")
    private String bloodGroup;

    private long phoneNumber;

    @NotBlank(message = "Address cannot be blank")
    private String address;

    @NotNull(message = "Gender is required")
    private Patient.Gender gender;
}
