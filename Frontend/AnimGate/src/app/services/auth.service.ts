import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, switchMap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthTokens, User } from '../models/anime.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  user = signal<User | null>(null);

  login(username: string, password: string): Observable<User | null> {
    return this.http.post<AuthTokens>(`${this.apiUrl}/login/`, { username, password }).pipe(
      tap((tokens) => {
        localStorage.setItem('access_token', tokens.access);
        localStorage.setItem('refresh_token', tokens.refresh);
      }),
      switchMap(() => this.getProfile()),
    );
  }

  register(username: string, email: string, password: string): Observable<User | null> {
    return this.http
      .post<AuthTokens>(`${this.apiUrl}/register/`, { username, email, password })
      .pipe(
        tap((tokens) => {
          localStorage.setItem('access_token', tokens.access);
          localStorage.setItem('refresh_token', tokens.refresh);
        }),
        switchMap(() => this.getProfile()),
      );
  }

  refreshToken(): Observable<AuthTokens | null> {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) return of(null);

    return this.http.post<AuthTokens>(`${this.apiUrl}/token/refresh/`, { refresh }).pipe(
      tap((tokens) => {
        localStorage.setItem('access_token', tokens.access);
      }),
      catchError((err) => {
        console.error('Token refresh failed:', err);
        this.logout();
        return of(null);
      }),
    );
  }

  getProfile(): Observable<User | null> {
    return this.http.post<User>(`${this.apiUrl}/profile/`, {}).pipe(
      tap((user) => {
        this.user.set(user);
        if (user.is_staff) {
          localStorage.setItem('is_admin', 'true');
        } else {
          localStorage.removeItem('is_admin');
        }
      }),
      catchError((err) => {
        console.error('Erreur chargement profil:', err);
        if (err.status === 401) this.logout();
        return of(null);
      }),
    );
  }

  updateProfile(data: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/profile`, data);
  }

  init(): void {
    if (this.isAuthenticated() && !this.user()) {
      this.getProfile().subscribe();
    }
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('is_admin');
    this.user.set(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  isAdmin(): boolean {
    return localStorage.getItem('is_admin') === 'true';
  }

  getHomeRoute(): string {
    return this.isAdmin() ? '/admin/dashboard' : '/home';
  }
}
