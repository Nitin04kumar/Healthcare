package org.healthcare.repository;

import org.healthcare.models.Doctor;
import org.healthcare.models.DoctorAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface DoctorAvailabilityRepository extends JpaRepository<DoctorAvailability, Long> {

    List<DoctorAvailability> findByDoctorAndDate(Doctor doctor, LocalDate date);

    List<DoctorAvailability> findByDoctorOrderByDateAscTimeSlotAsc(Doctor doctor);

    /**
     * Finds all available slots for a specific doctor that are on or after a given date.
     * Spring Data JPA automatically creates the query from this method name.
     * @param doctor The doctor entity to search for.
     * @param date The date to search after.
     * @return A list of available doctor slots.
     */
    List<DoctorAvailability> findByDoctorAndDateAfterAndIsAvailableTrue(Doctor doctor, LocalDate date);
}