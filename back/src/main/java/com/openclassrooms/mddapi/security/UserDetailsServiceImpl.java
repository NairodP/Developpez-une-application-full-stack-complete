package com.openclassrooms.mddapi.security;

import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Autowired
    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        // identifier peut être un email ou un username
        Optional<User> userByEmail = userRepository.findByEmail(identifier);
        Optional<User> userByUsername = userRepository.findByUsername(identifier);
        
        User user = userByEmail.orElseGet(() -> 
                    userByUsername.orElseThrow(() -> 
                        new UsernameNotFoundException("Utilisateur non trouvé avec l'identifiant: " + identifier)));

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),  // Toujours utiliser l'email comme identifiant principal
                user.getPassword(),
                new ArrayList<>());
    }
}
