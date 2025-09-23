package org.healthcare.service;

import org.healthcare.dto.PatientForDoctorDto;
import org.healthcare.dto.PatientHistoryDto;
import org.healthcare.models.User;
import java.util.List;

public interface DoctorPatientService {
    List<PatientForDoctorDto> getAssociatedPatients(User doctorUser);
    PatientHistoryDto getPatientHistory(User doctorUser, Long patientId);
}