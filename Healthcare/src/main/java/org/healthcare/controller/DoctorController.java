package org.healthcare.controller;

import org.healthcare.dto.ChangePasswordDto;
import org.healthcare.dto.DoctorProfileDto;
import org.healthcare.dto.UpdateDoctorProfileDto;
import org.healthcare.dto.DoctorPublicProfileDto;
import jakarta.validation.Valid;
import org.healthcare.dto.DoctorDto;
import org.healthcare.service.DoctorService;
import org.healthcare.response.ApiResponse;
import org.healthcare.models.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
@Slf4j
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping("/top-rated")
    public ResponseEntity<ApiResponse<List<DoctorDto>>> getTopRatedDoctors() {
        log.info("Request received for /api/doctors/top-rated");
        List<DoctorDto> topDoctors = doctorService.getTopRatedDoctors();
        log.info("Successfully fetched {} top-rated doctors.", topDoctors.size());
        return ResponseEntity.ok(ApiResponse.success(topDoctors));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<DoctorProfileDto>> getMyProfile(@AuthenticationPrincipal User currentUser) {
        DoctorProfileDto profile = doctorService.getDoctorProfile(currentUser);
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<DoctorProfileDto>> updateMyProfile(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody UpdateDoctorProfileDto profileDto) {
        DoctorProfileDto updatedProfile = doctorService.updateDoctorProfile(currentUser, profileDto);
        return ResponseEntity.ok(ApiResponse.success(updatedProfile));
    }

    @PatchMapping("/me/change-password")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody ChangePasswordDto passwordDto) {
        doctorService.changePassword(currentUser, passwordDto);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully."));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<DoctorPublicProfileDto>>> getAllDoctors() {
        List<DoctorPublicProfileDto> doctors = doctorService.getAllDoctorsForPatients();
        return ResponseEntity.ok(ApiResponse.success(doctors));
    }
}