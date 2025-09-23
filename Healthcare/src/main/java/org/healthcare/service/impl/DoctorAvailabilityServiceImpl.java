package org.healthcare.service.impl;

import lombok.RequiredArgsConstructor;
import org.healthcare.dto.availability.CreateAvailabilityDto;
import org.healthcare.dto.availability.UpdateAvailabilityDto;
import org.healthcare.dto.availability.AvailabilityDto;
import org.healthcare.models.Doctor;
import org.healthcare.models.DoctorAvailability;
import org.healthcare.models.User;
import org.healthcare.repository.DoctorAvailabilityRepository;
import org.healthcare.repository.DoctorRepository;
import org.healthcare.service.DoctorAvailabilityService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorAvailabilityServiceImpl implements DoctorAvailabilityService {

    private final DoctorAvailabilityRepository availabilityRepository;
    private final DoctorRepository doctorRepository;

    @Override
    @Transactional
    public AvailabilityDto addAvailability(User doctorUser, CreateAvailabilityDto createDto) {
        Doctor doctor = findDoctorByUser(doctorUser);

        DoctorAvailability newSlot = DoctorAvailability.builder()
                .doctor(doctor)
                .date(createDto.getDate())
                .timeSlot(createDto.getTimeSlot())
                .isAvailable(createDto.getIsAvailable())
                .build();

        DoctorAvailability savedSlot = availabilityRepository.save(newSlot);
        return AvailabilityDto.fromEntity(savedSlot);
    }

    @Override
    public List<AvailabilityDto> getAvailabilityForDate(User doctorUser, LocalDate date) {
        Doctor doctor = findDoctorByUser(doctorUser);
        return availabilityRepository.findByDoctorAndDate(doctor, date).stream()
                .map(AvailabilityDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AvailabilityDto updateAvailability(User doctorUser, Long availabilityId, UpdateAvailabilityDto updateDto) {
        DoctorAvailability slot = findSlotById(availabilityId);
        verifyDoctorOwnership(doctorUser, slot);

        slot.setIsAvailable(updateDto.getIsAvailable());
        DoctorAvailability updatedSlot = availabilityRepository.save(slot);
        return AvailabilityDto.fromEntity(updatedSlot);
    }

    @Override
    @Transactional
    public void deleteAvailability(User doctorUser, Long availabilityId) {
        DoctorAvailability slot = findSlotById(availabilityId);
        verifyDoctorOwnership(doctorUser, slot);
        availabilityRepository.delete(slot);
    }

    @Override
    public List<AvailabilityDto> getAllAvailability(User doctorUser) {
        Doctor doctor = findDoctorByUser(doctorUser);

        // Use the new repository method to fetch and sort all slots
        return availabilityRepository.findByDoctorOrderByDateAscTimeSlotAsc(doctor).stream()
                .map(AvailabilityDto::fromEntity)
                .collect(Collectors.toList());
    }

    private Doctor findDoctorByUser(User user) {
        return doctorRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Doctor profile not found."));
    }

    private DoctorAvailability findSlotById(Long availabilityId) {
        return availabilityRepository.findById(availabilityId)
                .orElseThrow(() -> new IllegalArgumentException("Availability slot not found."));
    }


    private void verifyDoctorOwnership(User doctorUser, DoctorAvailability slot) {
        if (!slot.getDoctor().getUser().getId().equals(doctorUser.getId())) {
            throw new AccessDeniedException("You do not have permission to modify this availability slot.");
        }
    }
}