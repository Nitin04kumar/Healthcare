package org.healthcare.service;


import org.healthcare.dto.AppointmentDto;
import org.healthcare.dto.BookAppointmentDto;
import org.healthcare.models.Appointment;
import org.healthcare.models.User;

import java.util.List;

public interface AppointmentService {
    AppointmentDto bookAppointment(User patientUser, BookAppointmentDto bookingDetails);
    List<AppointmentDto> getAppointmentsForDoctor(User doctorUser);
    AppointmentDto updateAppointmentStatus(Long appointmentId, User doctorUser, Appointment.Status newStatus);

    List<AppointmentDto> getUpcomingAppointmentsForPatient(User patientUser);
    List<AppointmentDto> getAppointmentHistoryForPatient(User patientUser);
    AppointmentDto updateAppointmentReason(Long appointmentId, User patientUser, String newReason);
    AppointmentDto cancelAppointmentByPatient(Long appointmentId, User patientUser);
}