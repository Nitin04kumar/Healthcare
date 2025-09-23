package org.healthcare.service;

import org.healthcare.dto.ChangePasswordDto;
import org.healthcare.dto.DoctorDto;
import org.healthcare.dto.DoctorProfileDto;
import org.healthcare.dto.UpdateDoctorProfileDto;
import org.healthcare.dto.DoctorPublicProfileDto;
import org.healthcare.models.User;


import java.util.List;

public interface DoctorService {
    List<DoctorDto> getTopRatedDoctors();

    DoctorProfileDto getDoctorProfile(User currentUser);
    DoctorProfileDto updateDoctorProfile(User currentUser, UpdateDoctorProfileDto profileDto);
    void changePassword(User currentUser, ChangePasswordDto passwordDto);
    List<DoctorPublicProfileDto> getAllDoctorsForPatients();
}
