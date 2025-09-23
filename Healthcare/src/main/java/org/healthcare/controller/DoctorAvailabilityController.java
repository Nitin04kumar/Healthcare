package org.healthcare.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.healthcare.dto.availability.CreateAvailabilityDto;
import org.healthcare.dto.availability.UpdateAvailabilityDto;
import org.healthcare.dto.availability.AvailabilityDto;
import org.healthcare.models.User;
import org.healthcare.response.ApiResponse;
import org.healthcare.service.DoctorAvailabilityService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/doctors/availability")
@RequiredArgsConstructor
@PreAuthorize("hasRole('DOCTOR')")
public class DoctorAvailabilityController {

    private final DoctorAvailabilityService availabilityService;

    @PostMapping
    public ResponseEntity<ApiResponse<AvailabilityDto>> addAvailability(
            @AuthenticationPrincipal User doctorUser,
            @Valid @RequestBody CreateAvailabilityDto createDto) {
        AvailabilityDto newSlot = availabilityService.addAvailability(doctorUser, createDto);
        return new ResponseEntity<>(ApiResponse.success(newSlot), HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<AvailabilityDto>>> getAllAvailability(
            @AuthenticationPrincipal User doctorUser) {
        List<AvailabilityDto> allSlots = availabilityService.getAllAvailability(doctorUser);
        return ResponseEntity.ok(ApiResponse.success(allSlots));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AvailabilityDto>>> getAvailability(
            @AuthenticationPrincipal User doctorUser,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<AvailabilityDto> slots = availabilityService.getAvailabilityForDate(doctorUser, date);
        return ResponseEntity.ok(ApiResponse.success(slots));
    }

    @PatchMapping("/{availabilityId}")
    public ResponseEntity<ApiResponse<AvailabilityDto>> updateAvailability(
            @AuthenticationPrincipal User doctorUser,
            @PathVariable Long availabilityId,
            @Valid @RequestBody UpdateAvailabilityDto updateDto) {
        AvailabilityDto updatedSlot = availabilityService.updateAvailability(doctorUser, availabilityId, updateDto);
        return ResponseEntity.ok(ApiResponse.success(updatedSlot));
    }

    @DeleteMapping("/{availabilityId}")
    public ResponseEntity<ApiResponse<String>> deleteAvailability(
            @AuthenticationPrincipal User doctorUser,
            @PathVariable Long availabilityId) {
        availabilityService.deleteAvailability(doctorUser, availabilityId);
        return ResponseEntity.ok(ApiResponse.success("Availability slot deleted successfully."));
    }
}