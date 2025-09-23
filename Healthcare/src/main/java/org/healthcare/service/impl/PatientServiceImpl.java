package org.healthcare.service.impl;


import lombok.RequiredArgsConstructor;
import org.healthcare.dto.PatientProfileDto;
import org.healthcare.dto.UpdatePatientProfileDto;
import org.healthcare.models.Patient;
import org.healthcare.models.User;
import org.healthcare.repository.PatientRepository;
import org.healthcare.service.PatientService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public  class PatientServiceImpl implements PatientService {
    private final PatientRepository patientRepository;

    private Patient findPatientByUser(User user) {
        return patientRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Patient profile not found for the current user."));
    }

    public PatientProfileDto getPatientProfile(User currentUser){
        Patient patient = findPatientByUser(currentUser);
        return  PatientProfileDto.fromEntity(patient);
    }

    public PatientProfileDto updatePatientProfile (User currentUser , UpdatePatientProfileDto profileDto){
        Patient patient = findPatientByUser(currentUser);
        patient.setName(profileDto.getName());
        patient.setAge(profileDto.getAge());
        patient.setBloodGroup(profileDto.getBloodGroup());
        patient.setPhoneNumber(profileDto.getPhoneNumber());
        patient.setAddress(profileDto.getAddress());
       // patient.setGender(profileDto.getGender());

        Patient updatedPatient = patientRepository.save(patient);
        return PatientProfileDto.fromEntity(updatedPatient);
    }
}
