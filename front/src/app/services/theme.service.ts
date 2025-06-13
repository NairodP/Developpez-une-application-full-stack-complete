import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Theme } from '../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private apiUrl = `${environment.apiUrl}/themes`;

  constructor(private http: HttpClient) {}

  getAllThemes(): Observable<Theme[]> {
    return this.http.get<Theme[]>(this.apiUrl);
  }

  getThemeById(id: number): Observable<Theme> {
    return this.http.get<Theme>(`${this.apiUrl}/${id}`);
  }

  createTheme(theme: Theme): Observable<Theme> {
    return this.http.post<Theme>(this.apiUrl, theme);
  }

  updateTheme(id: number, theme: Theme): Observable<Theme> {
    return this.http.put<Theme>(`${this.apiUrl}/${id}`, theme);
  }

  deleteTheme(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
