package org.healthcare.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.healthcare.dto.ConsultationDto;
import org.healthcare.dto.CreateConsultationDto;
import org.healthcare.models.User;
import org.healthcare.response.ApiResponse;
import org.healthcare.service.ConsultationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/consultations")
@RequiredArgsConstructor
@PreAuthorize("hasRole('DOCTOR')")
public class ConsultationController {

    private final ConsultationService consultationService;

    @PostMapping("/{appointmentId}")
    public ResponseEntity<ApiResponse<ConsultationDto>> createConsultation(
            @PathVariable Long appointmentId,
            @AuthenticationPrincipal User doctorUser,
            @Valid @RequestBody CreateConsultationDto consultationDto) {
        ConsultationDto createdConsultation = consultationService.createConsultation(appointmentId, doctorUser, consultationDto);
        return new ResponseEntity<>(ApiResponse.success(createdConsultation), HttpStatus.CREATED);
    }

    @GetMapping("/appointment/{appointmentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ConsultationDto>> getConsultationForAppointment(
            @PathVariable Long appointmentId,
            @AuthenticationPrincipal User currentUser) {
        ConsultationDto consultation = consultationService.getConsultationForAppointment(appointmentId, currentUser);
        return ResponseEntity.ok(ApiResponse.success(consultation));
    }
}