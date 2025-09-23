package org.healthcare.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.healthcare.models.Appointment;


@Data
public class UpdateAppointmentStatusDto {
    @NotNull
    private Appointment.Status status;
}