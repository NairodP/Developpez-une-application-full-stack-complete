import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../services/auth.service';
import { PasswordValidator } from '../../../validators/password.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, PasswordValidator.strongPassword()]]
    });
  }

  ngOnInit(): void {
    // Rediriger si déjà connecté
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    const signupData = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    };

    this.authService.register(signupData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open('Inscription réussie ! Vous pouvez maintenant vous connecter.', 'Fermer', {
            duration: 5000
          });
          this.router.navigate(['/auth/login']);
        },
        error: error => {
          this.isLoading = false;
          // Vérifier si l'erreur est un message du serveur
          const errorMessage = error.error ?? 'Échec de l\'inscription. Veuillez réessayer.';
          this.snackBar.open(errorMessage, 'Fermer', {
            duration: 3000
          });
          console.error('Erreur d\'inscription', error);
        }
      });
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  getPasswordRequirements(): string[] {
    const passwordControl = this.registerForm.get('password');
    return passwordControl ? PasswordValidator.getPasswordRequirements(passwordControl) : [];
  }
}
