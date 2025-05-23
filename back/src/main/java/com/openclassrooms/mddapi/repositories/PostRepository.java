package com.openclassrooms.mddapi.repositories;

import com.openclassrooms.mddapi.models.Post;
import com.openclassrooms.mddapi.models.Theme;
import com.openclassrooms.mddapi.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByAuthor(User author);
    List<Post> findByTheme(Theme theme);
    
    @Query("SELECT p FROM Post p WHERE p.author = ?1 ORDER BY p.createdAt DESC")
    List<Post> findByAuthorOrderByCreatedAtDesc(User author);
    
    // Méthode de compatibilité pour l'ancien modèle avec plusieurs thèmes
    default List<Post> findByThemesContaining(Theme theme) {
        return findByTheme(theme);
    }
    
    // Méthode de compatibilité pour l'ancien modèle avec plusieurs thèmes
    default List<Post> findByThemesInOrderByCreatedAtDesc(List<Theme> themes) {
        if (themes == null || themes.isEmpty()) {
            return findAll();
        }
        return findByTheme(themes.get(0));
    }
}
