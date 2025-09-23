package org.healthcare.repository;

import org.healthcare.models.Doctor;
import org.healthcare.models.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    @Query("SELECT d FROM Doctor d ORDER BY d.rating DESC")
    List<Doctor> findTopRatedDoctors(Pageable pageable);

    Optional<Doctor> findByUser(User user);
}
