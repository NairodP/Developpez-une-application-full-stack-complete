import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'MDD - Réseau social de développeurs';
  isLoggedIn = false;
  isAuthPage = false;
  currentUser: User | null = null;
  isMobileMenuOpen = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
    });
    
    if (this.authService.isLoggedIn() && !this.currentUser) {
      this.authService.loadCurrentUser();
    }
    
    // Détecter si on est sur une page d'authentification
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isAuthPage = event.url.includes('/auth/login') || event.url.includes('/auth/register');
        // Fermer le menu mobile lors de la navigation
        this.isMobileMenuOpen = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}
