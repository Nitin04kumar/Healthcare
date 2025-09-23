package org.healthcare.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data // Creates all the getters and setters for you
public class RegisterDoctorDto {

    // --- Fields for the User entity (Authentication) ---
    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;

    // --- Fields for the Doctor entity (Profile) ---
    @NotBlank
    private String name;

    @NotBlank
    private String specialization;

    private int exp;
    private String qualification;
    private float rating;
}