import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  AnimeCard,
  Suggestion,
  Genre,
  Category,
  Episode,
  AdminStats,
  AnimeDetailAdmin,
} from '../models/anime.models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Stats
  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.apiUrl}/admin/stats/`);
  }

  // Animes
  getAnimes(): Observable<AnimeCard[]> {
    return this.http.get<AnimeCard[]>(`${this.apiUrl}/admin/anims`);
  }

  getAnimeDetail(slug: string): Observable<AnimeDetailAdmin> {
    return this.http.get<AnimeDetailAdmin>(`${this.apiUrl}/admin/anims/${slug}`);
  }

  createAnime(formData: FormData): Observable<AnimeCard> {
    return this.http.post<AnimeCard>(`${this.apiUrl}/admin/anims/`, formData);
  }

  updateAnime(slug: string, data: Partial<AnimeDetailAdmin>): Observable<AnimeDetailAdmin> {
    return this.http.patch<AnimeDetailAdmin>(`${this.apiUrl}/admin/anims/${slug}/`, data);
  }

  deleteAnime(slug: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/anims/${slug}/`);
  }

  // Episodes
  getAnimeEpisodes(slug: string): Observable<Episode[]> {
    return this.http.get<Episode[]>(`${this.apiUrl}/admin/anims/${slug}/episodes`);
  }

  createEpisode(formData: FormData): Observable<Episode> {
    return this.http.post<Episode>(`${this.apiUrl}/admin/episode/`, formData);
  }

  updateEpisode(id: number, formData: FormData): Observable<Episode> {
    return this.http.patch<Episode>(`${this.apiUrl}/admin/episode/${id}/`, formData);
  }

  deleteEpisode(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/episode/${id}`);
  }

  // Genres
  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(`${this.apiUrl}/genres/`);
  }

  createGenre(name: string): Observable<Genre> {
    return this.http.post<Genre>(`${this.apiUrl}/genres/`, { name: name });
  }

  updateGenre(id: number, data: Partial<Genre>): Observable<Genre> {
    return this.http.patch<Genre>(`${this.apiUrl}/genres/${id}/`, data);
  }

  deleteGenre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/genres/${id}/`);
  }

  // Categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories/`);
  }

  createCategory(name: string): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/categories/`, { name: name });
  }

  updateCategory(id: number, data: Partial<Category>): Observable<Category> {
    return this.http.patch<Category>(`${this.apiUrl}/categories/${id}/`, data);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categories/${id}/`);
  }

  // Suggestions
  getSuggestions(): Observable<Suggestion[]> {
    return this.http.get<Suggestion[]>(`${this.apiUrl}/admin/suggestions/`);
  }

  updateSuggestionState(id: number, state: 'accepted' | 'rejected'): Observable<Suggestion> {
    return this.http.patch<Suggestion>(`${this.apiUrl}/admin/suggestions/${id}/`, { state });
  }
}
