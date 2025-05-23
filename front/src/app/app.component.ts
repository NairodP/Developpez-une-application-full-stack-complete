import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
    });
    
    if (this.authService.isLoggedIn() && !this.currentUser) {
      this.authService.loadCurrentUser();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
