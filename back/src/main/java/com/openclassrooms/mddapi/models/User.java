package com.openclassrooms.mddapi.models;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.time.LocalDateTime;

@Entity
@Table(name = "utilisateur")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "prenom", nullable = false)
    private String firstName;

    @Column(name = "nom", nullable = false)
    private String lastName;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "mot_de_passe", nullable = false)
    private String password;

    @Column(name = "date_inscription")
    private LocalDateTime createdAt;

    @ManyToMany
    @JoinTable(
        name = "abonnement",
        joinColumns = @JoinColumn(name = "utilisateur_id"),
        inverseJoinColumns = @JoinColumn(name = "theme_id")
    )
    private Set<Theme> followedThemes = new HashSet<>();

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL)
    private List<Post> posts = new ArrayList<>();

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL)
    private List<Comment> comments = new ArrayList<>();

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        // Utilisons l'email comme nom d'utilisateur puisque la table n'a pas de colonne username
        return email;
    }

    public void setUsername(String username) {
        // Cette méthode ne fait rien car nous utilisons l'email comme identifiant
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getBio() {
        // Cette propriété n'est pas dans le schéma de BDD
        return null;
    }

    public void setBio(String bio) {
        // Cette méthode ne fait rien car la propriété n'existe pas en BDD
    }

    public String getProfilePictureUrl() {
        // Cette propriété n'est pas dans le schéma de BDD
        return null;
    }

    public void setProfilePictureUrl(String profilePictureUrl) {
        // Cette méthode ne fait rien car la propriété n'existe pas en BDD
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        // Cette propriété n'est pas dans le schéma de BDD
        return createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        // Cette méthode ne fait rien car la propriété n'existe pas en BDD
    }

    public Set<Theme> getFollowedThemes() {
        return followedThemes;
    }

    public void setFollowedThemes(Set<Theme> followedThemes) {
        this.followedThemes = followedThemes;
    }

    public List<Post> getPosts() {
        return posts;
    }

    public void setPosts(List<Post> posts) {
        this.posts = posts;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }
}
