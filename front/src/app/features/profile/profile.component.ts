import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User } from 'src/app/models/user.model';
import { Theme } from 'src/app/models/post.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { PasswordValidator } from '../../validators/password.validator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  currentUser: User | null = null;
  userSubscriptions: Theme[] = [];
  
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly subscriptionService: SubscriptionService,
    private readonly router: Router
  ) {}  ngOnInit(): void {
    this.createForm();
    this.loadCurrentUser();
    
    // S'abonner aux changements d'abonnements
    this.subscriptionService.userSubscriptions$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((themes: Theme[]) => {
        this.userSubscriptions = themes;
      });
    
    // Charger les abonnements lors de l'initialisation
    this.subscriptionService.loadUserSubscriptions()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  createForm(): void {
    this.profileForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [PasswordValidator.strongPassword()]]
    });
  }

  loadCurrentUser(): void {
    this.userService.getCurrentUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user: User) => {
          this.currentUser = user;
          this.profileForm.patchValue({
            username: user.username,
            email: user.email,
            password: '' // Ne pas pré-remplir le mot de passe
          });
        },
        error: (err) => {
          console.error('Erreur lors du chargement du profil', err);
        }
      });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }

    const formData = this.profileForm.value;

    const updateData: any = {};

    if (formData.username && formData.username !== this.currentUser?.username) {
      updateData.username = formData.username;
    }

    if (formData.email && formData.email !== this.currentUser?.email) {
      updateData.email = formData.email;
    }

    if (formData.password && formData.password.trim() !== '') {
      updateData.password = formData.password;
    }

    this.userService.updateCurrentUser(updateData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updatedUser: User) => {
          this.currentUser = updatedUser;
          this.profileForm.patchValue({ password: '' });
          this.authService.loadCurrentUser();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du profil', err);
        }
      });
  }

  logout(): void {
    this.subscriptionService.clearSubscriptions();
    this.authService.logout();
    this.router.navigate(['/']);
  }

  unsubscribeFromTheme(theme: Theme): void {
    if (!theme.id) return;

    this.subscriptionService.unsubscribeFromTheme(theme.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          // Les abonnements seront automatiquement mis à jour via le service
          console.log(`Désabonné du thème ${theme.name}`);
        },
        error: (err: any) => {
          console.error('Erreur lors du désabonnement', err);
        }
      });
  }

  getPasswordRequirements(): string[] {
    const passwordControl = this.profileForm.get('password');
    return passwordControl ? PasswordValidator.getPasswordRequirements(passwordControl) : [];
  }
}
