import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Theme } from '../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly apiUrl = `${environment.apiUrl}/themes`;

  constructor(private readonly http: HttpClient) {}

  getAllThemes(): Observable<Theme[]> {
    return this.http.get<Theme[]>(this.apiUrl);
  }

  getThemeById(id: number): Observable<Theme> {
    return this.http.get<Theme>(`${this.apiUrl}/${id}`);
  }
}
