package org.healthcare.repository;


import org.healthcare.models.Patient;
import org.healthcare.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient , Long> {
    Optional<Patient> findByUser(User user);
}
