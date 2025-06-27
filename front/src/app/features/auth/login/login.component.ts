import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar
  ) {
    this.loginForm = this.formBuilder.group({
      identifier: ['', Validators.required], // Changé de email à identifier
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Rediriger si déjà connecté
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    const loginData = {
      identifier: this.loginForm.value.identifier,
      password: this.loginForm.value.password
    };

    this.authService.login(loginData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/']);
        },
        error: error => {
          this.isLoading = false;
          this.snackBar.open('Échec de la connexion. Veuillez vérifier vos identifiants.', 'Fermer', {
            duration: 3000
          });
          console.error('Erreur de connexion', error);
        }
      });
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
