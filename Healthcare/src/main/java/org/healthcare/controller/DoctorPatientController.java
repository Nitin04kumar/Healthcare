package org.healthcare.controller;

import lombok.RequiredArgsConstructor;
import org.healthcare.dto.PatientForDoctorDto;
import org.healthcare.dto.PatientHistoryDto;
import org.healthcare.models.User;
import org.healthcare.response.ApiResponse;
import org.healthcare.service.DoctorPatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/doctor-panel")
@RequiredArgsConstructor
@PreAuthorize("hasRole('DOCTOR')")
public class DoctorPatientController {

    private final DoctorPatientService doctorPatientService;

    @GetMapping("/patients")
    public ResponseEntity<ApiResponse<List<PatientForDoctorDto>>> getMyPatients(@AuthenticationPrincipal User doctorUser) {
        List<PatientForDoctorDto> patients = doctorPatientService.getAssociatedPatients(doctorUser);
        return ResponseEntity.ok(ApiResponse.success(patients));
    }

    @GetMapping("/patients/{patientId}/history")
    public ResponseEntity<ApiResponse<PatientHistoryDto>> getPatientHistory(
            @AuthenticationPrincipal User doctorUser,
            @PathVariable Long patientId) {
        PatientHistoryDto history = doctorPatientService.getPatientHistory(doctorUser, patientId);
        return ResponseEntity.ok(ApiResponse.success(history));
    }
}