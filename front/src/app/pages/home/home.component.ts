import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    
    if (this.isLoggedIn) {
      // Charger les données de l'utilisateur si ce n'est pas déjà fait
      if (!this.authService.currentUserValue) {
        this.authService.loadCurrentUser();
      }
    }
  }

  start() {
    if (this.isLoggedIn) {
      this.router.navigate(['/posts']);
    } else {
      this.router.navigate(['/auth/login']);
    }
}
