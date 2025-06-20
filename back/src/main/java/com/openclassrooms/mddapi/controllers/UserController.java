package com.openclassrooms.mddapi.controllers;

import com.openclassrooms.mddapi.dto.UserDto;
import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.repositories.UserRepository;
import com.openclassrooms.mddapi.validation.PasswordValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Optional<User> user = userRepository.findByEmail(email);
        return user.map(value -> ResponseEntity.ok(convertToDto(value)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(value -> ResponseEntity.ok(convertToDto(value)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UserDto> createUser(@RequestBody User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        User savedUser = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(savedUser));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @RequestBody User user) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        user.setId(id);
        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(convertToDto(updatedUser));
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentUser(@RequestBody User userUpdate) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();
        Optional<User> userOpt = userRepository.findByEmail(currentEmail);
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        User existingUser = userOpt.get();
        
        // Mise à jour du username avec vérification d'unicité
        if (userUpdate.getUsername() != null && !userUpdate.getUsername().trim().isEmpty()) {
            if (!userUpdate.getUsername().equals(existingUser.getUsername())) {
                if (userRepository.existsByUsername(userUpdate.getUsername())) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body("Username déjà utilisé");
                }
                existingUser.setUsername(userUpdate.getUsername());
            }
        }
        
        // Mise à jour de l'email avec vérification d'unicité
        if (userUpdate.getEmail() != null && !userUpdate.getEmail().trim().isEmpty()) {
            if (!userUpdate.getEmail().equals(existingUser.getEmail())) {
                if (userRepository.existsByEmail(userUpdate.getEmail())) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body("Email déjà utilisé");
                }
                existingUser.setEmail(userUpdate.getEmail());
            }
        }
        
        // Mise à jour du mot de passe avec validation forte et cryptage
        if (userUpdate.getPassword() != null && !userUpdate.getPassword().trim().isEmpty()) {
            if (!PasswordValidator.isValid(userUpdate.getPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial");
            }
            existingUser.setPassword(passwordEncoder.encode(userUpdate.getPassword()));
        }
        
        try {
            User updatedUser = userRepository.save(existingUser);
            return ResponseEntity.ok(convertToDto(updatedUser));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de la mise à jour");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setFollowedThemeIds(user.getFollowedThemes().stream()
                .map(theme -> theme.getId())
                .collect(Collectors.toSet()));
        return dto;
    }
}
