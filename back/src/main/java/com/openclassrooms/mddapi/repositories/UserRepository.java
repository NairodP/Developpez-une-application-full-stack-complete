package com.openclassrooms.mddapi.repositories;

import com.openclassrooms.mddapi.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Méthodes pour l'email
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    
    // Méthodes pour le username
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
}
