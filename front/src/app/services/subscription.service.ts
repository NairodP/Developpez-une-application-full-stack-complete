import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Theme } from '../models/post.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private readonly apiUrl = `${environment.apiUrl}/themes`;
  private readonly userSubscriptionsSubject = new BehaviorSubject<Theme[]>([]);
  public userSubscriptions$ = this.userSubscriptionsSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  /**
   * Charge les abonnements de l'utilisateur connecté
   */
  loadUserSubscriptions(): Observable<Theme[]> {
    return this.http.get<Theme[]>(`${this.apiUrl}/subscriptions`).pipe(
      tap(themes => this.userSubscriptionsSubject.next(themes))
    );
  }

  /**
   * S'abonner à un thème
   */
  subscribeToTheme(themeId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${themeId}/subscribe`, {}).pipe(
      tap(() => {
        // Recharger la liste des abonnements après l'action
        this.loadUserSubscriptions().subscribe();
      })
    );
  }

  /**
   * Se désabonner d'un thème
   */
  unsubscribeFromTheme(themeId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${themeId}/unsubscribe`).pipe(
      tap(() => {
        // Recharger la liste des abonnements après l'action
        this.loadUserSubscriptions().subscribe();
      })
    );
  }

  /**
   * Vérifie si l'utilisateur est abonné à un thème
   */
  isUserSubscribed(themeId: number): boolean {
    const currentSubscriptions = this.userSubscriptionsSubject.value;
    return currentSubscriptions.some(theme => theme.id === themeId);
  }

  /**
   * Obtient la liste actuelle des abonnements
   */
  getCurrentSubscriptions(): Theme[] {
    return this.userSubscriptionsSubject.value;
  }

  /**
   * Réinitialise les abonnements (utile lors de la déconnexion)
   */
  clearSubscriptions(): void {
    this.userSubscriptionsSubject.next([]);
  }
}
