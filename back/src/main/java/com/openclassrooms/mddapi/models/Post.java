package com.openclassrooms.mddapi.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "article")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "titre", nullable = false)
    private String title;

    @Column(name = "contenu", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "date_creation")
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "auteur_id", nullable = false)
    @JsonIgnoreProperties({"posts", "comments", "followedThemes", "password"})
    private User author;

    @ManyToOne
    @JoinColumn(name = "theme_id")
    @JsonIgnoreProperties({"posts", "followers"})
    private Theme theme;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Comment> comments = new ArrayList<>();

    // Pour maintenir la compatibilité avec le code existant
    @Transient
    private Set<Theme> themes = new HashSet<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        // Cette propriété n'est pas dans le schéma de BDD, on retourne la date de création
        return createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        // Cette méthode ne fait rien car la propriété n'existe pas en BDD
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public Theme getTheme() {
        return theme;
    }

    public void setTheme(Theme theme) {
        this.theme = theme;
    }

    public Set<Theme> getThemes() {
        // Pour la rétrocompatibilité, nous retournons un ensemble avec le thème unique
        Set<Theme> result = new HashSet<>();
        if (theme != null) {
            result.add(theme);
        }
        return result;
    }

    public void setThemes(Set<Theme> themes) {
        // Pour la rétrocompatibilité, nous prenons le premier thème s'il existe
        if (themes != null && !themes.isEmpty()) {
            this.theme = themes.iterator().next();
        }
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }
}
