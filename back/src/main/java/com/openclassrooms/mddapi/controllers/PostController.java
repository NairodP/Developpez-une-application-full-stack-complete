package com.openclassrooms.mddapi.controllers;

import com.openclassrooms.mddapi.models.Post;
import com.openclassrooms.mddapi.models.Theme;
import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.repositories.PostRepository;
import com.openclassrooms.mddapi.repositories.ThemeRepository;
import com.openclassrooms.mddapi.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final ThemeRepository themeRepository;

    @Autowired
    public PostController(PostRepository postRepository, UserRepository userRepository, ThemeRepository themeRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.themeRepository = themeRepository;
    }

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        List<Post> posts = postRepository.findAll();
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id) {
        Optional<Post> post = postRepository.findById(id);
        return post.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        
        // Utiliser l'email comme identifiant dans notre système
        Optional<User> user = userRepository.findByEmail(currentUsername);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        post.setAuthor(user.get());
        post.setCreatedAt(LocalDateTime.now());

        // Gérer le thème par nom
        if (post.getTheme() != null && post.getTheme().getName() != null && !post.getTheme().getName().trim().isEmpty()) {
            String themeName = post.getTheme().getName().trim();
            
            // Chercher si le thème existe déjà
            Optional<Theme> existingTheme = themeRepository.findByName(themeName);
            
            if (existingTheme.isPresent()) {
                // Utiliser le thème existant
                post.setTheme(existingTheme.get());
            } else {
                // Créer un nouveau thème
                Theme newTheme = new Theme();
                newTheme.setName(themeName);
                newTheme.setDescription("Thème créé automatiquement");
                Theme savedTheme = themeRepository.save(newTheme);
                post.setTheme(savedTheme);
            }
        } else {
            return ResponseEntity.badRequest().build(); // Thème obligatoire
        }

        Post savedPost = postRepository.save(post);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPost);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable Long id, @RequestBody Post post) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();

        Optional<Post> existingPost = postRepository.findById(id);
        if (existingPost.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Vérifier que l'utilisateur actuel est bien l'auteur
        if (!existingPost.get().getAuthor().getEmail().equals(currentEmail)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Post postToUpdate = existingPost.get();
        postToUpdate.setTitle(post.getTitle());
        postToUpdate.setContent(post.getContent());
        
        // Gérer le thème unique dans notre modèle
        if (post.getThemes() != null && !post.getThemes().isEmpty()) {
            Theme theme = post.getThemes().iterator().next();
            Optional<Theme> validTheme = themeRepository.findById(theme.getId());
            if (validTheme.isPresent()) {
                postToUpdate.setTheme(validTheme.get());
            }
        }

        Post updatedPost = postRepository.save(postToUpdate);
        return ResponseEntity.ok(updatedPost);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();

        Optional<Post> existingPost = postRepository.findById(id);
        if (existingPost.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (!existingPost.get().getAuthor().getEmail().equals(currentEmail)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        postRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/theme/{themeId}")
    public ResponseEntity<List<Post>> getPostsByTheme(@PathVariable Long themeId) {
        Optional<Theme> theme = themeRepository.findById(themeId);
        if (theme.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        List<Post> posts = postRepository.findByTheme(theme.get());
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Post>> getPostsByUser(@PathVariable Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        List<Post> posts = postRepository.findByAuthorOrderByCreatedAtDesc(user.get());
        return ResponseEntity.ok(posts);
    }
}
