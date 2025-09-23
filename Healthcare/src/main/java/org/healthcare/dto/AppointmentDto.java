package org.healthcare.dto;

import lombok.Builder;
import lombok.Data;
import org.healthcare.models.Appointment;

import java.time.LocalDate;

@Data
@Builder
public class AppointmentDto {
    private Long appointmentId;
    private Long doctorId;
    private String doctorName;
    private Long patientId;
    private String patientName;
    private LocalDate date;
    private String timeSlot;
    private Appointment.Status status;
    private String reason;

    public static AppointmentDto fromEntity(Appointment appointment) {
        return AppointmentDto.builder()
                .appointmentId(appointment.getAppointmentId())
                .doctorId(appointment.getDoctor().getId())
                .doctorName(appointment.getDoctor().getName())
                .patientId(appointment.getPatient().getId())
                .patientName(appointment.getPatient().getName())
                .date(appointment.getDate())
                .timeSlot(appointment.getTimeSlot())
                .status(appointment.getStatus())
                .reason(appointment.getReason())
                .build();
    }
}