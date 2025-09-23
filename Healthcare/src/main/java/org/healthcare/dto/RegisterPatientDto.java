package org.healthcare.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.healthcare.models.Patient;


import java.time.LocalDate;

@Data
public class RegisterPatientDto {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 8 ,  message = "Password must be at least 8 characters long")
    private String password;

    @NotBlank
    private String name;

    @NotNull
    private int age;

    @NotNull
    private LocalDate dob ;

    @NotBlank
    private String bloodGroup;

    @NotNull
    private long phoneNumber;

    @NotBlank
    private String address;

    @NotNull
    private Patient.Gender gender;


}
