package org.healthcare.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.healthcare.dto.AppointmentDto;
import org.healthcare.dto.UpdateAppointmentDto;
import org.healthcare.models.User;
import org.healthcare.response.ApiResponse;
import org.healthcare.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patient-appointments")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PATIENT')")
public class PatientAppointmentController {

    private final AppointmentService appointmentService;

    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<AppointmentDto>>> getUpcomingAppointments(@AuthenticationPrincipal User patientUser) {
        List<AppointmentDto> appointments = appointmentService.getUpcomingAppointmentsForPatient(patientUser);
        return ResponseEntity.ok(ApiResponse.success(appointments));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<AppointmentDto>>> getAppointmentHistory(@AuthenticationPrincipal User patientUser) {
        List<AppointmentDto> appointments = appointmentService.getAppointmentHistoryForPatient(patientUser);
        return ResponseEntity.ok(ApiResponse.success(appointments));
    }

    @PatchMapping("/{appointmentId}/reason")
    public ResponseEntity<ApiResponse<AppointmentDto>> updateAppointmentReason(
            @PathVariable Long appointmentId,
            @AuthenticationPrincipal User patientUser,
            @Valid @RequestBody UpdateAppointmentDto updateDto) {
        AppointmentDto updatedAppointment = appointmentService.updateAppointmentReason(appointmentId, patientUser, updateDto.getReason());
        return ResponseEntity.ok(ApiResponse.success(updatedAppointment));
    }

    @PatchMapping("/{appointmentId}/cancel")
    public ResponseEntity<ApiResponse<AppointmentDto>> cancelAppointment(@PathVariable Long appointmentId, @AuthenticationPrincipal User patientUser) {
        AppointmentDto cancelledAppointment = appointmentService.cancelAppointmentByPatient(appointmentId, patientUser);
        return ResponseEntity.ok(ApiResponse.success(cancelledAppointment));
    }
}