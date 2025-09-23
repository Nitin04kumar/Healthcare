package org.healthcare.repository;


import org.healthcare.models.Appointment;
import org.healthcare.models.Doctor;
import org.healthcare.models.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

        List<Appointment> findByDoctor(Doctor doctor);
        List<Appointment> findByPatient(Patient patient);

        List<Appointment> findByPatientAndDateGreaterThanEqualOrderByDateAscTimeSlotAsc(Patient patient, LocalDate date);
        List<Appointment> findByPatientAndDateBeforeOrderByDateDescTimeSlotDesc(Patient patient, LocalDate date);

        @Query("SELECT DISTINCT a.patient FROM Appointment a WHERE a.doctor = :doctor")
        List<Patient> findDistinctPatientsByDoctor(Doctor doctor);

        // --- ADD THIS MISSING METHOD ---
        /**
         * Finds all appointments between a specific doctor and patient, sorted by the most recent first.
         * @param doctor The doctor entity.
         * @param patient The patient entity.
         * @return A list of appointments.
         */
        List<Appointment> findByDoctorAndPatientOrderByDateDesc(Doctor doctor, Patient patient);
}