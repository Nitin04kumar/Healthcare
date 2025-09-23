package org.healthcare.controller;


import lombok.RequiredArgsConstructor;
import org.healthcare.dto.PatientProfileDto;
import org.healthcare.dto.UpdatePatientProfileDto;
import org.healthcare.models.User;
import org.healthcare.repository.UserRepository;
import org.healthcare.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PATIENT')")
public class PatientController {

    private final PatientService patientService;
    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<PatientProfileDto> getMyProfile(@AuthenticationPrincipal UserDetails principal){
        User currentUser = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found for current principal"));
        PatientProfileDto profile = patientService.getPatientProfile(currentUser);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/me")
    public ResponseEntity<PatientProfileDto> updateMyProfile(
            @AuthenticationPrincipal UserDetails principal ,
            @RequestBody UpdatePatientProfileDto profileDto){
        User currentUser = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found for current principal"));
        PatientProfileDto updateProfile = patientService.updatePatientProfile(currentUser , profileDto);
        return ResponseEntity.ok(updateProfile);
    }
}