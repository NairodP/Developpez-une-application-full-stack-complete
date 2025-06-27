import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Post, Theme } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit, OnDestroy {
  postForm!: FormGroup;
  availableThemes = ['data', 'front', 'back'];
  isSubmitting = false;
  error: string | null = null;
  
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly postService: PostService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createForm(): void {
    this.postForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      themeName: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.postForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.error = null;
    
    // Récupération des données du formulaire
    const formData = this.postForm.value;
    
    // Création d'un objet thème avec le nom sélectionné
    const theme: Theme = {
      name: formData.themeName
    };
    
    // Création de l'objet post avec le thème
    const postData: Post = {
      title: formData.title,
      content: formData.content,
      theme: theme
    };

    this.postService.createPost(postData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (createdPost) => {
          this.isSubmitting = false;
          this.router.navigate(['/posts']);
        },
        error: (err) => {
          console.error('Erreur lors de la création de l\'article', err);
          this.error = err.error ?? 'Erreur lors de la création de l\'article';
          this.isSubmitting = false;
        }
      });
  }
}
