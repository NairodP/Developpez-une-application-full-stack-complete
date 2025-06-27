import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Post, Theme } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {
  postForm!: FormGroup;
  availableThemes: Theme[] = [];
  isSubmitting = false;
  isLoadingThemes = false;
  error: string | null = null;
  
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly postService: PostService,
    private readonly themeService: ThemeService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.loadThemes();
  }

  loadThemes(): void {
    this.isLoadingThemes = true;
    this.themeService.getAllThemes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (themes: Theme[]) => {
          this.availableThemes = themes;
          this.isLoadingThemes = false;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des thèmes', err);
          this.error = 'Erreur lors du chargement des thèmes';
          this.isLoadingThemes = false;
        }
      });
  }

  createForm(): void {
    this.postForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      themeId: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.postForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.error = null;
    
    // Récupération des données du formulaire
    const formData = this.postForm.value;
    
    // Trouver le thème sélectionné
    const selectedTheme = this.availableThemes.find(theme => theme.id === Number(formData.themeId));
    
    if (!selectedTheme) {
      this.error = 'Veuillez sélectionner un thème valide';
      this.isSubmitting = false;
      return;
    }
    
    // Création de l'objet post avec le thème sélectionné
    const postData: Post = {
      title: formData.title,
      content: formData.content,
      theme: {
        id: selectedTheme.id,
        name: selectedTheme.name
      }
    };

    this.postService.createPost(postData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (createdPost) => {
          this.isSubmitting = false;
          this.router.navigate(['/posts']);
        },
        error: (err) => {
          console.error('Erreur lors de la création de l\'article', err);
          this.error = err.error?.message ?? 'Erreur lors de la création de l\'article';
          this.isSubmitting = false;
        }
      });
  }
}
