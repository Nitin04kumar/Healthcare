package org.healthcare.dto;

import lombok.Builder;
import lombok.Data;
import org.healthcare.models.Patient;
import java.util.List;

@Data
@Builder
public class PatientHistoryDto {
    private PatientProfileDto patientProfile;
    private List<AppointmentDto> appointments;
    private List<ConsultationDto> consultations;

    public static PatientHistoryDto from(Patient patient, List<AppointmentDto> appointments, List<ConsultationDto> consultations) {
        return PatientHistoryDto.builder()
                .patientProfile(PatientProfileDto.fromEntity(patient))
                .appointments(appointments)
                .consultations(consultations)
                .build();
    }
}