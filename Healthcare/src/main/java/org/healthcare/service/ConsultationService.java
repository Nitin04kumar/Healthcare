package org.healthcare.service;

import org.healthcare.dto.ConsultationDto;
import org.healthcare.dto.CreateConsultationDto;
import org.healthcare.models.User;


import java.util.List;

public interface ConsultationService {
    ConsultationDto createConsultation(Long appointmentId, User doctorUser, CreateConsultationDto consultationDto);
    ConsultationDto getConsultationForAppointment(Long appointmentId, User currentUser);
    List<ConsultationDto> getAllConsultationsForPatient(User patientUser);
}