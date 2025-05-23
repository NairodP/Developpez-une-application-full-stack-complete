package com.openclassrooms.mddapi.models;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "commentaire")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "contenu", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "date_commentaire")
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "auteur_id", nullable = false)
    private User author;

    @ManyToOne
    @JoinColumn(name = "article_id", nullable = false)
    private Post post;

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
        // Cette propriété n'est pas dans le schéma de BDD
        // On utilise createdAt comme substitut tout en ajoutant un commentaire pour débogage
        return createdAt; // Substitut de updatedAt
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

    public Post getPost() {
        return post;
    }

    public void setPost(Post post) {
        this.post = post;
    }
}
