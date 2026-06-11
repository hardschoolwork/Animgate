import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  HomeFeed,
  AnimeDetail,
  Episode,
  EpisodeDetail,
  Notification,
  Favorite,
  Suggestion,
  AnimeCard,
} from '../models/anime.models';

@Injectable({ providedIn: 'root' })
export class AnimeService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getHomeFeed(): Observable<HomeFeed> {
    return this.http.get<HomeFeed>(`${this.apiUrl}/home/feed`);
  }

  getAnimeDetail(slug: string): Observable<AnimeDetail> {
    return this.http.get<AnimeDetail>(`${this.apiUrl}/anims/${slug}`);
  }

  getAnimeEpisodes(slug: string): Observable<Episode[]> {
    return this.http.get<Episode[]>(`${this.apiUrl}/anims/${slug}/episodes`);
  }

  getEpisodeDetail(id: number): Observable<EpisodeDetail> {
    return this.http.get<EpisodeDetail>(`${this.apiUrl}/anim/episode/${id}`);
  }

  // ✅ Méthode corrigée avec tous les paramètres de filtrage
  getAnimes(params?: {
    type?: string;
    status?: string;
    is_trending?: boolean;
    is_new_release?: boolean;
    age_rating?: string;
    search?: string;
  }): Observable<AnimeCard[]> {
    let httpParams = new HttpParams();

    if (params?.type) httpParams = httpParams.set('type', params.type);
    if (params?.status) httpParams = httpParams.set('status', params.status);
    if (params?.is_trending !== undefined)
      httpParams = httpParams.set('is_trending', String(params.is_trending));
    if (params?.is_new_release !== undefined)
      httpParams = httpParams.set('is_new_release', String(params.is_new_release));
    if (params?.age_rating) httpParams = httpParams.set('age_rating', params.age_rating);
    if (params?.search) httpParams = httpParams.set('search', params.search);

    return this.http.get<AnimeCard[]>(`${this.apiUrl}/anims/`, { params: httpParams });
  }

  getFavorites(): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(`${this.apiUrl}/favorites/`);
  }

  addFavorite(animId: number): Observable<Favorite> {
    return this.http.post<Favorite>(`${this.apiUrl}/favorites/`, { anim: animId });
  }

  removeFavorite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/favorite/${id}`);
  }

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/notifications/`);
  }

  getNotificationDetail(id: number): Observable<Notification> {
    return this.http.get<Notification>(`${this.apiUrl}/notification/${id}`);
  }

  markNotificationAsRead(id: number): Observable<Notification> {
    return this.http.patch<Notification>(`${this.apiUrl}/notification/${id}`, { is_read: true });
  }

  getSuggestions(): Observable<Suggestion[]> {
    return this.http.get<Suggestion[]>(`${this.apiUrl}/suggestions`);
  }

  submitSuggestion(suggested_anim: string, message: string): Observable<Suggestion> {
    return this.http.post<Suggestion>(`${this.apiUrl}/suggestions/`, { suggested_anim, message });
  }
}
