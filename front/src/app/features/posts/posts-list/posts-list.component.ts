import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/models/post.model';

type SortOrder = 'asc' | 'desc';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent implements OnInit {
  posts: Post[] = [];
  originalPosts: Post[] = [];
  isLoading = false;
  error: string | null = null;
  
  // Propriétés pour le tri par date
  currentSortOrder: SortOrder = 'desc'; // Le plus récent en premier par défaut
  showSortMenu = false;

  constructor(private readonly postService: PostService) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.isLoading = true;
    this.error = null;

    this.postService.getAllPosts().subscribe({
      next: (data) => {
        this.originalPosts = [...data];
        this.posts = [...data];
        this.applySorting(); // Applique le tri par défaut (plus récent en premier)
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des articles', err);
        this.error = 'Une erreur est survenue lors du chargement des articles.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Bascule entre tri par date croissant et décroissant
   */
  toggleDateSort(): void {
    this.currentSortOrder = this.currentSortOrder === 'asc' ? 'desc' : 'asc';
    this.applySorting();
    this.showSortMenu = false;
  }

  /**
   * Tri par date la plus récente
   */
  sortByNewest(): void {
    this.currentSortOrder = 'desc';
    this.applySorting();
    this.showSortMenu = false;
  }

  /**
   * Tri par date la plus ancienne
   */
  sortByOldest(): void {
    this.currentSortOrder = 'asc';
    this.applySorting();
    this.showSortMenu = false;
  }

  /**
   * Applique le tri par date aux articles
   */
  applySorting(): void {
    this.posts = [...this.originalPosts].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      // Pour 'desc' (plus récent): dateB - dateA (récent en premier)
      // Pour 'asc' (plus ancien): dateA - dateB (ancien en premier)
      return this.currentSortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }

  /**
   * Bascule l'affichage du menu de tri
   */
  toggleSortMenu(): void {
    this.showSortMenu = !this.showSortMenu;
  }

  /**
   * Ferme le menu de tri
   */
  closeSortMenu(): void {
    this.showSortMenu = false;
  }
}
