import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Theme } from 'src/app/models/post.model';
import { ThemeService } from 'src/app/services/theme.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-themes-list',
  templateUrl: './themes-list.component.html',
  styleUrls: ['./themes-list.component.scss']
})
export class ThemesListComponent implements OnInit {
  themes: Theme[] = [];
  currentUser: User | null = null;
  isLoading = false;
  error: string | null = null;
  
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly themeService: ThemeService,
    private readonly subscriptionService: SubscriptionService,
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadThemes();
    this.subscriptionService.loadUserSubscriptions()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  loadCurrentUser(): void {
    this.authService.currentUser
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user: User | null) => {
        this.currentUser = user;
      });
  }

  loadThemes(): void {
    this.isLoading = true;
    this.error = null;

    this.themeService.getAllThemes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (themes: Theme[]) => {
          this.themes = themes;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des thèmes', err);
          this.error = 'Une erreur est survenue lors du chargement des thèmes.';
          this.isLoading = false;
        }
      });
  }

  isUserSubscribed(themeId: number): boolean {
    return this.subscriptionService.isUserSubscribed(themeId);
  }

  toggleSubscription(theme: Theme): void {
    if (!theme.id) return;

    const isSubscribed = this.isUserSubscribed(theme.id);
    
    if (isSubscribed) {
      this.subscriptionService.unsubscribeFromTheme(theme.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            console.log(`Désabonné du thème ${theme.name}`);
          },
          error: (err: any) => {
            console.error('Erreur lors du désabonnement', err);
            this.error = 'Erreur lors du désabonnement au thème';
          }
        });
    } else {
      this.subscriptionService.subscribeToTheme(theme.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            console.log(`Abonné au thème ${theme.name}`);
          },
          error: (err: any) => {
            console.error('Erreur lors de l\'abonnement', err);
            this.error = 'Erreur lors de l\'abonnement au thème';
          }
        });
    }
  }
}
