package org.healthcare.repository;

import org.healthcare.models.RefreshToken;
import org.healthcare.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    // --- THIS IS THE FIX ---
    // Replace the old method with this explicit JPQL query.
    // This guarantees a DELETE operation is executed.
    @Modifying
    @Query("DELETE FROM RefreshToken t WHERE t.user = :user")
    void deleteByUser(@Param("user") User user);
}