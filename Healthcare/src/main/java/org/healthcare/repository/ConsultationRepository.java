package org.healthcare.repository;


import org.healthcare.models.Appointment;
import org.healthcare.models.Consultation;
import org.healthcare.models.Patient;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;
import java.util.Optional;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    Optional<Consultation> findByAppointment(Appointment appointment);
    List<Consultation> findByPatientOrderByDateDesc(Patient patient);
}