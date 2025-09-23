package org.healthcare.dto;

import lombok.Builder;
import lombok.Data;
import org.healthcare.models.Consultation;

import java.time.LocalDate;

@Data
@Builder
public class ConsultationDto {
    private Long consultationId;
    private Long appointmentId;
    private Long patientId;
    private Long doctorId;
    private LocalDate date;
    private String symptoms;
    private String bloodPressure;
    private int height;
    private int weight;
    private String description;
    private String notes;
    private Consultation.Status status;

    public static ConsultationDto fromEntity(Consultation consultation) {
        return ConsultationDto.builder()
                .consultationId(consultation.getConsultationId())
                .appointmentId(consultation.getAppointment().getAppointmentId())
                .patientId(consultation.getPatient().getId())
                .doctorId(consultation.getDoctor().getId())
                .date(consultation.getDate())
                .symptoms(consultation.getSymptoms())
                .bloodPressure(consultation.getBloodPressure())
                .height(consultation.getHeight())
                .weight(consultation.getWeight())
                .description(consultation.getDescription())
                .notes(consultation.getNotes())
                .status(consultation.getStatus())
                .build();
    }
}