package org.healthcare.service;

import org.healthcare.dto.availability.CreateAvailabilityDto;
import org.healthcare.dto.availability.UpdateAvailabilityDto;
import org.healthcare.dto.availability.AvailabilityDto;
import org.healthcare.models.User;

import java.time.LocalDate;
import java.util.List;

public interface DoctorAvailabilityService {
    AvailabilityDto addAvailability(User doctorUser, CreateAvailabilityDto createDto);
    List<AvailabilityDto> getAvailabilityForDate(User doctorUser, LocalDate date);
    AvailabilityDto updateAvailability(User doctorUser, Long availabilityId, UpdateAvailabilityDto updateDto);
    List<AvailabilityDto> getAllAvailability(User doctorUser);
    void deleteAvailability(User doctorUser, Long availabilityId);
}