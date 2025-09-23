package org.healthcare.controller;

import lombok.RequiredArgsConstructor;
import org.healthcare.dto.ConsultationDto;
import org.healthcare.models.User;
import org.healthcare.response.ApiResponse;
import org.healthcare.service.ConsultationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patient-consultations")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PATIENT')")
public class PatientConsultationController {

    private final ConsultationService consultationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ConsultationDto>>> getAllMyConsultations(@AuthenticationPrincipal User patientUser) {
        List<ConsultationDto> consultations = consultationService.getAllConsultationsForPatient(patientUser);
        return ResponseEntity.ok(ApiResponse.success(consultations));
    }
}