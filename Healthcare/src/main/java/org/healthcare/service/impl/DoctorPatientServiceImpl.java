package org.healthcare.service.impl;

import lombok.RequiredArgsConstructor;
import org.healthcare.dto.PatientForDoctorDto;
import org.healthcare.dto.PatientHistoryDto;
import org.healthcare.dto.AppointmentDto;
import org.healthcare.dto.ConsultationDto;
import org.healthcare.models.Doctor;
import org.healthcare.models.User;
import org.healthcare.models.Appointment;
import org.healthcare.models.Consultation;
import org.healthcare.models.Patient;
import org.healthcare.repository.DoctorRepository;
import org.healthcare.repository.PatientRepository;
import org.healthcare.repository.AppointmentRepository;
import org.healthcare.repository.ConsultationRepository;
import org.healthcare.service.DoctorPatientService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorPatientServiceImpl implements DoctorPatientService {

    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final ConsultationRepository consultationRepository;

    @Override
    public List<PatientForDoctorDto> getAssociatedPatients(User doctorUser) {
        Doctor doctor = findDoctorByUser(doctorUser);

        // --- FIX: Use the new, efficient query instead of the slow stream ---
        return appointmentRepository.findDistinctPatientsByDoctor(doctor).stream()
                .map(PatientForDoctorDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public PatientHistoryDto getPatientHistory(User doctorUser, Long patientId) {
        Doctor doctor = findDoctorByUser(doctorUser);
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found with ID: " + patientId));

        // Security Check: Verify this patient has had an appointment with this doctor
        List<Appointment> appointments = appointmentRepository.findByDoctorAndPatientOrderByDateDesc(doctor, patient);
        if (appointments.isEmpty()) {
            throw new AccessDeniedException("You do not have permission to view this patient's history.");
        }

        // Fetch all consultations for the patient
        List<Consultation> consultations = consultationRepository.findByPatientOrderByDateDesc(patient);

        // Convert to DTOs
        List<AppointmentDto> appointmentDtos = appointments.stream().map(AppointmentDto::fromEntity).collect(Collectors.toList());
        List<ConsultationDto> consultationDtos = consultations.stream().map(ConsultationDto::fromEntity).collect(Collectors.toList());

        return PatientHistoryDto.from(patient, appointmentDtos, consultationDtos);
    }

    private Doctor findDoctorByUser(User user) {
        return doctorRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Doctor profile not found for the current user."));
    }
}