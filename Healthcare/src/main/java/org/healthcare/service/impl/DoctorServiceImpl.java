package org.healthcare.service.impl;


import org.healthcare.dto.ChangePasswordDto;
import org.healthcare.dto.DoctorPublicProfileDto;
import org.healthcare.dto.DoctorDto;
import org.healthcare.dto.DoctorProfileDto;
import org.healthcare.dto.UpdateDoctorProfileDto;
import org.healthcare.dto.availability.AvailabilityDto;
import org.healthcare.repository.DoctorAvailabilityRepository;
import org.healthcare.models.Doctor;
import org.healthcare.models.User;
import org.healthcare.repository.DoctorRepository;
import org.healthcare.repository.UserRepository;
import org.healthcare.service.DoctorService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation for doctor-related operations.
 * Implements methods for public data fetching and secured profile management.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    // --- DEPENDENCIES ---
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final DoctorAvailabilityRepository availabilityRepository;

    /**
     * Fetches a list of the top 3 rated doctors for public display.
     * @return A list of DoctorDto objects.
     */
    @Override
    public List<DoctorDto> getTopRatedDoctors() {
        log.info("Fetching top 3 rated doctors.");
        Pageable topThree = PageRequest.of(0, 3);
        List<Doctor> doctors = doctorRepository.findTopRatedDoctors(topThree);
        return doctors.stream()
                .map(this::convertToPublicDto)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves the full profile of the currently authenticated doctor.
     * @param currentUser The authenticated User object.
     * @return A DTO with the doctor's detailed profile information.
     */
    @Override
    public DoctorProfileDto getDoctorProfile(User currentUser) {
        Doctor doctor = findDoctorByUser(currentUser);
        return DoctorProfileDto.fromEntity(doctor);
    }

    /**
     * Updates the profile information for the currently authenticated doctor.
     * @param currentUser The authenticated User object.
     * @param profileDto DTO containing the fields to update.
     * @return The updated doctor profile DTO.
     */
    @Override
    @Transactional
    public DoctorProfileDto updateDoctorProfile(User currentUser, UpdateDoctorProfileDto profileDto) {
        Doctor doctor = findDoctorByUser(currentUser);

        doctor.setName(profileDto.getName());
        doctor.setSpecialization(profileDto.getSpecialization());
        doctor.setExp(profileDto.getExp());
        doctor.setQualification(profileDto.getQualification());

        Doctor updatedDoctor = doctorRepository.save(doctor);
        log.info("Updated profile for doctor ID: {}", updatedDoctor.getId());
        return DoctorProfileDto.fromEntity(updatedDoctor);
    }

    /**
     * Changes the password for the currently authenticated user.
     * @param currentUser The authenticated User object.
     * @param passwordDto DTO containing the current and new passwords.
     */

    @Override
    @Transactional
    public void changePassword(User currentUser, ChangePasswordDto passwordDto) {
        // --- LOGS FOR DEBUGGING ---
        log.info("Attempting password change for user: {}", currentUser.getEmail());
        if (passwordEncoder == null) {
            log.error("FATAL: PasswordEncoder is NULL.");
            // The method will crash on the next line, but this log will tell you why.
        }
        if (userRepository == null) {
            log.error("FATAL: UserRepository is NULL.");
        }
        // --- END OF DEBUGGING LOGS ---

        // 1. Verify the current password
        if (!passwordEncoder.matches(passwordDto.getCurrentPassword(), currentUser.getPassword())) {
            log.warn("Password change failed: Incorrect current password for user {}", currentUser.getEmail());
            throw new BadCredentialsException("Incorrect current password provided.");
        }

        // 2. Encode and set the new password
        currentUser.setPassword(passwordEncoder.encode(passwordDto.getNewPassword()));

        // 3. Save the updated user
        userRepository.save(currentUser);
        log.info("Password changed successfully for user: {}", currentUser.getEmail());
    }

    /**
     * A private helper method to find a Doctor profile using the associated User account.
     * Throws an exception if no profile is found.
     * @param user The User entity.
     * @return The found Doctor entity.
     */
    private Doctor findDoctorByUser(User user) {
        return doctorRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Doctor profile not found for the current user."));
    }

    @Override
    public List<DoctorPublicProfileDto> getAllDoctorsForPatients() {
        List<Doctor> allDoctors = doctorRepository.findAll();

        return allDoctors.stream().map(doctor -> {
            // Fetch only available slots for today and the future
            List<AvailabilityDto> availableSlots = availabilityRepository
                    // Ensure your repository has this method
                    .findByDoctorAndDateAfterAndIsAvailableTrue(doctor, LocalDate.now().minusDays(1))
                    .stream()
                    .map(AvailabilityDto::fromEntity)
                    .collect(Collectors.toList());

            return DoctorPublicProfileDto.fromEntity(doctor, availableSlots);
        }).collect(Collectors.toList());
    }

    /**
     * Converts a Doctor entity to its public-facing DTO representation.
     * @param doctor The Doctor entity.
     * @return A DoctorDto object.
     */
    private DoctorDto convertToPublicDto(Doctor doctor) {
        return DoctorDto.builder()
                .id(doctor.getId())
                .name(doctor.getName())
                .specialization(doctor.getSpecialization())
                .rating(doctor.getRating())
                .exp(doctor.getExp())
                .build();
    }
}