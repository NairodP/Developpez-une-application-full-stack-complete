package com.openclassrooms.mddapi.controllers;

import com.openclassrooms.mddapi.dto.JwtResponse;
import com.openclassrooms.mddapi.dto.LoginRequest;
import com.openclassrooms.mddapi.dto.SignupRequest;
import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.repositories.UserRepository;
import com.openclassrooms.mddapi.security.JwtTokenUtil;
import com.openclassrooms.mddapi.security.UserDetailsServiceImpl;
import com.openclassrooms.mddapi.validation.PasswordValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) throws Exception {
        try {
            // L'identifiant peut être un email ou un username
            String identifier = loginRequest.getIdentifier();
            authenticate(identifier, loginRequest.getPassword());
            final UserDetails userDetails = userDetailsService.loadUserByUsername(identifier);
            final String token = jwtTokenUtil.generateToken(userDetails);
            return ResponseEntity.ok(new JwtResponse(token));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Identifiants incorrects");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody SignupRequest signupRequest) {
        // Validation du mot de passe
        if (!PasswordValidator.isValid(signupRequest.getPassword())) {
            return ResponseEntity.badRequest().body(PasswordValidator.getValidationMessage());
        }
        
        // Vérifie si l'email est déjà utilisé
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Email déjà utilisé");
        }
        
        // Vérifie si le nom d'utilisateur est déjà utilisé
        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            return ResponseEntity.badRequest().body("Nom d'utilisateur déjà utilisé");
        }

        User user = new User();
        user.setEmail(signupRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setUsername(signupRequest.getUsername());
        // La bio n'est pas supportée dans notre schéma actuel

        userRepository.save(user);

        return ResponseEntity.ok("Utilisateur enregistré avec succès");
    }

    private void authenticate(String username, String password) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            throw new Exception("UTILISATEUR_DÉSACTIVÉ", e);
        } catch (BadCredentialsException e) {
            throw new Exception("IDENTIFIANTS_INVALIDES", e);
        }
    }
}
