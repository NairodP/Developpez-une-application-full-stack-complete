import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Post, Theme } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post.service';
import { ThemeService } from 'src/app/services/theme.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {
  postForm!: FormGroup;
  themes: Theme[] = [];
  filteredThemes: Observable<Theme[]> | undefined;
  isSubmitting = false;

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

  createForm(): void {
    this.postForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      themeName: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  loadThemes(): void {
    this.themeService.getAllThemes().subscribe({
      next: (themes) => {
        this.themes = themes;
        // Initialiser le filtrage des thèmes après les avoir chargés
        this.initializeThemeFilter();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des thèmes', err);
      }
    });
  }

  initializeThemeFilter(): void {
    // Configurer le filtre pour l'autocomplétion
    this.filteredThemes = this.postForm.get('themeName')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filterThemes(value || ''))
    );
  }

  private _filterThemes(value: string): Theme[] {
    const filterValue = value.toLowerCase();
    return this.themes.filter(theme => 
      theme.name.toLowerCase().includes(filterValue)
    );
  }

  displayThemeFn(theme: Theme): string {
    return theme && theme.name ? theme.name : '';
  }

  onSubmit(): void {
    if (this.postForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    
    // Récupération des données du formulaire
    const formData = this.postForm.value;
    
    // Création d'un objet thème avec le nom saisi
    const theme: Theme = {
      name: formData.themeName
    };
    
    // Création de l'objet post avec le thème
    const postData: Post = {
      title: formData.title,
      content: formData.content,
      theme: theme
    };

    this.postService.createPost(postData).subscribe({
      next: (createdPost) => {
        this.isSubmitting = false;
        this.router.navigate(['/posts']);
      },
      error: (err) => {
        console.error('Erreur lors de la création de l\'article', err);
        this.isSubmitting = false;
      }
    });
  }
}
