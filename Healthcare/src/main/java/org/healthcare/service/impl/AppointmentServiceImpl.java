package org.healthcare.service.impl;

import lombok.RequiredArgsConstructor;

import org.healthcare.dto.AppointmentDto;
import org.healthcare.dto.BookAppointmentDto;

import org.healthcare.repository.AppointmentRepository;

import org.healthcare.models.Appointment;
import org.healthcare.models.Doctor;
import org.healthcare.models.Patient;
import org.healthcare.models.User;
import org.healthcare.repository.DoctorRepository;
import org.healthcare.repository.PatientRepository;
import org.healthcare.service.AppointmentService;
import org.healthcare.service.NotificationService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final NotificationService notificationService; // FIX: Add NotificationService as a dependency

    @Override
    @Transactional
    public AppointmentDto bookAppointment(User patientUser, BookAppointmentDto bookingDetails) {
        Patient patient = patientRepository.findByUser(patientUser)
                .orElseThrow(() -> new IllegalArgumentException("Patient profile not found."));

        Doctor doctor = doctorRepository.findById(bookingDetails.getDoctorId())
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found."));

        Appointment newAppointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .date(bookingDetails.getDate())
                .timeSlot(bookingDetails.getTimeSlot())
                .reason(bookingDetails.getReason())
                .specialty(doctor.getSpecialization())
                .status(Appointment.Status.Waiting)
                .build();

        Appointment savedAppointment = appointmentRepository.save(newAppointment);

        // Create a notification for the doctor
        String notificationMessage = "You have a new appointment request from " + patient.getName() + " for " + savedAppointment.getDate();
        notificationService.createNotification(doctor.getUser(), notificationMessage);

        return AppointmentDto.fromEntity(savedAppointment);
    }

    @Override
    public List<AppointmentDto> getAppointmentsForDoctor(User doctorUser) {
        Doctor doctor = doctorRepository.findByUser(doctorUser)
                .orElseThrow(() -> new IllegalArgumentException("Doctor profile not found."));

        return appointmentRepository.findByDoctor(doctor).stream()
                .map(AppointmentDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AppointmentDto updateAppointmentStatus(Long appointmentId, User doctorUser, Appointment.Status newStatus) {
        Doctor doctor = doctorRepository.findByUser(doctorUser)
                .orElseThrow(() -> new IllegalArgumentException("Doctor profile not found."));

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found."));

        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            throw new AccessDeniedException("You do not have permission to modify this appointment.");
        }

        appointment.setStatus(newStatus);
        Appointment updatedAppointment = appointmentRepository.save(appointment);

        // Create a notification for the patient
        String statusText = newStatus == Appointment.Status.Booked ? "confirmed" : "cancelled";
        String notificationMessage = "Dr. " + doctor.getName() + " has " + statusText + " your appointment for " + updatedAppointment.getDate();
        notificationService.createNotification(appointment.getPatient().getUser(), notificationMessage);

        return AppointmentDto.fromEntity(updatedAppointment);
    }


    @Override
    public List<AppointmentDto> getUpcomingAppointmentsForPatient(User patientUser) {
        Patient patient = findPatientByUser(patientUser);
        LocalDate today = LocalDate.now();

        return appointmentRepository.findByPatientAndDateGreaterThanEqualOrderByDateAscTimeSlotAsc(patient, today)
                .stream()
                .map(AppointmentDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentDto> getAppointmentHistoryForPatient(User patientUser) {
        Patient patient = findPatientByUser(patientUser);
        LocalDate today = LocalDate.now();

        return appointmentRepository.findByPatientAndDateBeforeOrderByDateDescTimeSlotDesc(patient, today)
                .stream()
                .map(AppointmentDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AppointmentDto updateAppointmentReason(Long appointmentId, User patientUser, String newReason) {
        Patient patient = findPatientByUser(patientUser);
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found."));

        // Security check: ensure the patient owns this appointment
        if (!appointment.getPatient().getId().equals(patient.getId())) {
            throw new AccessDeniedException("You do not have permission to modify this appointment.");
        }

        // Business rule: only allow updates for 'Waiting' or 'Booked' appointments
        if (appointment.getStatus() != Appointment.Status.Waiting && appointment.getStatus() != Appointment.Status.Booked) {
            throw new IllegalStateException("Cannot update an appointment that is already " + appointment.getStatus());
        }

        appointment.setReason(newReason);
        Appointment updatedAppointment = appointmentRepository.save(appointment);

        return AppointmentDto.fromEntity(updatedAppointment);
    }

    @Override
    @Transactional
    public AppointmentDto cancelAppointmentByPatient(Long appointmentId, User patientUser) {
        Appointment appointment = findAndVerifyPatientAppointment(appointmentId, patientUser);

        // Business rule: only allow cancellation for upcoming appointments
        if (appointment.getStatus() != Appointment.Status.Waiting && appointment.getStatus() != Appointment.Status.Booked) {
            throw new IllegalStateException("Cannot cancel an appointment that is already " + appointment.getStatus());
        }

        appointment.setStatus(Appointment.Status.Cancelled);
        Appointment updatedAppointment = appointmentRepository.save(appointment);

        // Notify the doctor about the cancellation
        String message = "Appointment with " + patientUser.getPatient().getName() + " on " + updatedAppointment.getDate() + " has been cancelled by the patient.";
        notificationService.createNotification(updatedAppointment.getDoctor().getUser(), message);

        return AppointmentDto.fromEntity(updatedAppointment);
    }

        // helper method to reduce code duplication
    private Appointment findAndVerifyPatientAppointment(Long appointmentId, User patientUser) {
        Patient patient = findPatientByUser(patientUser);
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found."));

        // Security check: ensure the patient owns this appointment
        if (!appointment.getPatient().getId().equals(patient.getId())) {
            throw new AccessDeniedException("You do not have permission to modify this appointment.");
        }
        return appointment;
    }

    private Patient findPatientByUser(User user) {
        return patientRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Patient profile not found."));
    }
}