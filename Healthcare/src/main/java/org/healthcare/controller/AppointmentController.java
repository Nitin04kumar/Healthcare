package org.healthcare.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.healthcare.dto.AppointmentDto;
import org.healthcare.dto.BookAppointmentDto;
import org.healthcare.dto.UpdateAppointmentStatusDto;
import org.healthcare.models.User;
import org.healthcare.response.ApiResponse;
import org.healthcare.service.AppointmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PATIENT')")
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping("/book")
    public ResponseEntity<ApiResponse<AppointmentDto>> bookAppointment(
            @AuthenticationPrincipal User patientUser,
            @Valid @RequestBody BookAppointmentDto bookingDetails) {
        AppointmentDto appointment = appointmentService.bookAppointment(patientUser, bookingDetails);
        return new ResponseEntity<>(ApiResponse.success(appointment), HttpStatus.CREATED);
    }

    @GetMapping("/doctor")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<List<AppointmentDto>>> getDoctorAppointments(@AuthenticationPrincipal User doctorUser) {
        List<AppointmentDto> appointments = appointmentService.getAppointmentsForDoctor(doctorUser);
        return ResponseEntity.ok(ApiResponse.success(appointments));
    }

    @PatchMapping("/{appointmentId}/status")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<AppointmentDto>> updateStatus(
            @PathVariable Long appointmentId,
            @AuthenticationPrincipal User doctorUser,
            @Valid @RequestBody UpdateAppointmentStatusDto statusDto) {
        AppointmentDto updatedAppointment = appointmentService.updateAppointmentStatus(appointmentId, doctorUser, statusDto.getStatus());
        return ResponseEntity.ok(ApiResponse.success(updatedAppointment));
    }
}