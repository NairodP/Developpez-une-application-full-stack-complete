import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  currentUser: User | null = null;
  isLoading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.loadCurrentUser();
  }

  createForm(): void {
    this.profileForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]]
    });
  }

  loadCurrentUser(): void {
    this.isLoading = true;
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.profileForm.patchValue({
          username: user.username,
          email: user.email,
          password: '' // Ne pas pré-remplir le mot de passe
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement du profil', err);
        this.error = 'Erreur lors du chargement du profil';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.success = null;

    const formData = this.profileForm.value;
    const emailChanged = this.currentUser && formData.email !== this.currentUser.email;
    
    // Ne pas envoyer le mot de passe s'il est vide
    const updateData: any = {
      username: formData.username,
      email: formData.email
    };

    if (formData.password && formData.password.trim() !== '') {
      updateData.password = formData.password;
    }

    this.userService.updateCurrentUser(updateData).subscribe({
      next: (updatedUser) => {
        this.currentUser = updatedUser;
        this.isLoading = false;
        
        // Réinitialiser le champ mot de passe
        this.profileForm.patchValue({ password: '' });
        
        if (emailChanged) {
          // Si l'email a changé, il faut déconnecter l'utilisateur car le token JWT est invalidé
          this.success = 'Profil mis à jour ! Vous devez vous reconnecter car votre email a changé.';
          setTimeout(() => {
            this.authService.logout();
            this.router.navigate(['/auth/login']);
          }, 3000);
        } else {
          this.success = 'Profil mis à jour avec succès !';
          // Mettre à jour l'utilisateur dans le service d'authentification
          this.authService.loadCurrentUser();
        }
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du profil', err);
        if (err.status === 409) {
          this.error = err.error ?? 'Ce nom d\'utilisateur ou cet email est déjà utilisé';
        } else {
          this.error = 'Erreur lors de la mise à jour du profil';
        }
        this.isLoading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}