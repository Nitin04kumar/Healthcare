package org.healthcare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.healthcare.models.Consultation;


@Data
public class CreateConsultationDto {
    @NotBlank(message = "Symptoms are required")
    private String symptoms;

    private String bloodPressure;
    private int height;
    private int weight;

    @NotBlank(message = "Description/Diagnosis is required")
    private String description;

    private String notes;

    @NotNull(message = "Status is required")
    private Consultation.Status status;
}