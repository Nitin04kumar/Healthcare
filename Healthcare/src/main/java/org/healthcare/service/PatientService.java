package org.healthcare.service;

import org.healthcare.dto.PatientProfileDto;
import org.healthcare.dto.UpdatePatientProfileDto;
import org.healthcare.models.User;

public interface PatientService {
    PatientProfileDto getPatientProfile(User currentUser);
    PatientProfileDto updatePatientProfile(User currentUser, UpdatePatientProfileDto profileDto);
}
