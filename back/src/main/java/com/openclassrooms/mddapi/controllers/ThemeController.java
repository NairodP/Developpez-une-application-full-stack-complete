package com.openclassrooms.mddapi.controllers;

import com.openclassrooms.mddapi.models.Theme;
import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.repositories.ThemeRepository;
import com.openclassrooms.mddapi.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/themes")
@CrossOrigin(origins = "*")
public class ThemeController {

    private final ThemeRepository themeRepository;
    private final UserRepository userRepository;

    @Autowired
    public ThemeController(ThemeRepository themeRepository, UserRepository userRepository) {
        this.themeRepository = themeRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Theme>> getAllThemes() {
        List<Theme> themes = themeRepository.findAll();
        return ResponseEntity.ok(themes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Theme> getThemeById(@PathVariable Long id) {
        Optional<Theme> theme = themeRepository.findById(id);
        return theme.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Theme> createTheme(@RequestBody Theme theme) {
        if (themeRepository.existsByName(theme.getName())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        
        Theme savedTheme = themeRepository.save(theme);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTheme);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Theme> updateTheme(@PathVariable Long id, @RequestBody Theme theme) {
        if (!themeRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        // Vérifier si le nouveau nom n'est pas déjà utilisé par un autre thème
        Optional<Theme> existingThemeWithName = themeRepository.findByName(theme.getName());
        if (existingThemeWithName.isPresent() && !existingThemeWithName.get().getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        
        theme.setId(id);
        Theme updatedTheme = themeRepository.save(theme);
        return ResponseEntity.ok(updatedTheme);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTheme(@PathVariable Long id) {
        if (!themeRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        themeRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/subscribe")
    public ResponseEntity<Void> subscribeToTheme(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Optional<User> userOpt = userRepository.findByEmail(email);
        Optional<Theme> themeOpt = themeRepository.findById(id);

        if (userOpt.isPresent() && themeOpt.isPresent()) {
            User user = userOpt.get();
            Theme theme = themeOpt.get();

            if (!user.getFollowedThemes().contains(theme)) {
                user.getFollowedThemes().add(theme);
                userRepository.save(user);
            }

            return ResponseEntity.ok().build();
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}/unsubscribe")
    public ResponseEntity<Void> unsubscribeFromTheme(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Optional<User> userOpt = userRepository.findByEmail(email);
        Optional<Theme> themeOpt = themeRepository.findById(id);

        if (userOpt.isPresent() && themeOpt.isPresent()) {
            User user = userOpt.get();
            Theme theme = themeOpt.get();

            user.getFollowedThemes().remove(theme);
            userRepository.save(user);

            return ResponseEntity.ok().build();
        }

        return ResponseEntity.notFound().build();
    }

    @GetMapping("/subscriptions")
    public ResponseEntity<List<Theme>> getUserSubscriptions() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            List<Theme> subscribedThemes = user.getFollowedThemes().stream()
                    .collect(Collectors.toList());
            return ResponseEntity.ok(subscribedThemes);
        }

        return ResponseEntity.notFound().build();
    }
}
