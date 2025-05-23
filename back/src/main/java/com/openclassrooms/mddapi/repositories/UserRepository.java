package com.openclassrooms.mddapi.repositories;

import com.openclassrooms.mddapi.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Utiliser l'email comme identifiant principal
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    
    // Garder cette méthode pour rétrocompatibilité avec le code qui utilise username
    default Optional<User> findByUsername(String username) {
        return findByEmail(username);
    }
    
    // Garder cette méthode pour rétrocompatibilité avec le code qui utilise username
    default boolean existsByUsername(String username) {
        return existsByEmail(username);
    }
}
