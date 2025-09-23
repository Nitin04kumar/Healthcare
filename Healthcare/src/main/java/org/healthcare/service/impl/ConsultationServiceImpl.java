package org.healthcare.service.impl;

import lombok.RequiredArgsConstructor;
import org.healthcare.dto.ConsultationDto;
import org.healthcare.dto.CreateConsultationDto;

import org.healthcare.repository.AppointmentRepository;
import org.healthcare.repository.ConsultationRepository;

import org.healthcare.service.ConsultationService;

import org.healthcare.models.Appointment;
import org.healthcare.models.Consultation;
import org.healthcare.models.Patient;
import org.healthcare.models.User;
import org.healthcare.repository.PatientRepository;
import org.healthcare.service.NotificationService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConsultationServiceImpl implements ConsultationService {

    private final ConsultationRepository consultationRepository;
    private final AppointmentRepository appointmentRepository;
    private final NotificationService notificationService;
    private final PatientRepository patientRepository;

    @Override
    @Transactional
    public ConsultationDto createConsultation(Long appointmentId, User doctorUser, CreateConsultationDto consultationDto) {
        // 1. Find the appointment
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found with ID: " + appointmentId));

        // 2. Security Check: Ensure the doctor owns this appointment
        if (!appointment.getDoctor().getUser().getId().equals(doctorUser.getId())) {
            throw new AccessDeniedException("You do not have permission to create a consultation for this appointment.");
        }

        // 3. Business Rule: Only allow consultation for 'Booked' appointments
        if (appointment.getStatus() != Appointment.Status.Booked) {
            throw new IllegalStateException("Consultation can only be created for 'Booked' appointments.");
        }

        // 4. Create the Consultation entity
        Consultation consultation = Consultation.builder()
                .appointment(appointment)
                .patient(appointment.getPatient())
                .doctor(appointment.getDoctor())
                .date(LocalDate.now())
                .symptoms(consultationDto.getSymptoms())
                .bloodPressure(consultationDto.getBloodPressure())
                .height(consultationDto.getHeight())
                .weight(consultationDto.getWeight())
                .description(consultationDto.getDescription())
                .notes(consultationDto.getNotes())
                .status(consultationDto.getStatus())
                .build();

        Consultation savedConsultation = consultationRepository.save(consultation);

        // 5. Update the appointment status to 'Completed'
        appointment.setStatus(Appointment.Status.Completed);
        appointmentRepository.save(appointment);

        // 6. Notify the patient
        String message = "Your consultation notes from Dr. " + appointment.getDoctor().getName() + " for your appointment on " + appointment.getDate() + " are now available.";
        notificationService.createNotification(appointment.getPatient().getUser(), message);

        return ConsultationDto.fromEntity(savedConsultation);
    }

    @Override
    public ConsultationDto getConsultationForAppointment(Long appointmentId, User currentUser) {
        // 1. Find the appointment
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found with ID: " + appointmentId));

        // 2. Find the associated consultation
        Consultation consultation = consultationRepository.findByAppointment(appointment)
                .orElseThrow(() -> new IllegalArgumentException("Consultation not found for this appointment."));

        // 3. CRITICAL SECURITY CHECK:
        // Verify that the current user is either the patient or the doctor for this appointment.
        Long patientUserId = appointment.getPatient().getUser().getId();
        Long doctorUserId = appointment.getDoctor().getUser().getId();
        Long currentUserId = currentUser.getId();

        if (!currentUserId.equals(patientUserId) && !currentUserId.equals(doctorUserId)) {
            throw new AccessDeniedException("You do not have permission to view this consultation.");
        }

        // 4. If authorized, return the details
        return ConsultationDto.fromEntity(consultation);
    }

    @Override
    public List<ConsultationDto> getAllConsultationsForPatient(User patientUser) {
        // 1. Find the patient profile for the current user
        Patient patient = patientRepository.findByUser(patientUser)
                .orElseThrow(() -> new IllegalArgumentException("Patient profile not found for the current user."));

        // 2. Fetch all consultations for that patient from the repository
        List<Consultation> consultations = consultationRepository.findByPatientOrderByDateDesc(patient);

        // 3. Convert the list of entities to a list of DTOs and return
        return consultations.stream()
                .map(ConsultationDto::fromEntity)
                .collect(Collectors.toList());
    }
}