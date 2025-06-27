import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  User,
} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private readonly http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(loginData: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginData).pipe(
      tap((response) => {
        if (response?.token) {
          localStorage.setItem('jwt_token', response.token);
          this.loadCurrentUser();
        }
      })
    );
  }

  register(signupData: SignupRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, signupData, {
      responseType: 'text',
    });
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);

    // Vider les abonnements lors de la déconnexion
    // Note: Nous utiliserons un service centralisé pour cela
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwt_token');
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  loadCurrentUser(): void {
    const token = this.getToken();
    if (!token) {
      this.logout();
      return;
    }

    this.http.get<User>(`${environment.apiUrl}/users/me`).subscribe({
      next: (user: User) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données utilisateur', error);
        // Si c'est une erreur 401 ou 403, le token est invalide
        if (error.status === 401 || error.status === 403) {
          this.logout();
        }
      }
    });
  }
}
