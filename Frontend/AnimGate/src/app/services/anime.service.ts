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
  WatchlistItem,
  WatchHistory,
  Genre,
  Category,
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

  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(`${this.apiUrl}/genres/`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories/`);
  }

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

  // === WATCH HISTORY ===
  saveWatchProgress(
    episodeId: number,
    progress: number,
    isCompleted: boolean = false,
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/watch-history/`, {
      episode: episodeId,
      progress_percentage: progress,
      is_completed: isCompleted,
    });
  }

  getWatchHistory(): Observable<WatchHistory[]> {
    return this.http.get<WatchHistory[]>(`${this.apiUrl}/watch-history/`);
  }

  // === WATCHLIST ===
  getWatchlist(): Observable<WatchlistItem[]> {
    return this.http.get<WatchlistItem[]>(`${this.apiUrl}/watchlist/`);
  }

  addToWatchlist(animeId: number): Observable<WatchlistItem> {
    return this.http.post<WatchlistItem>(`${this.apiUrl}/watchlist/`, { anime: animeId });
  }

  removeFromWatchlist(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/watchlist/${id}/`);
  }

  updateProfile(data: { username: string; email: string }): Observable<any> {
    return this.http.patch(`${this.apiUrl}/updateProfile/`, data);
  }

  changePassword(data: { old_password: string; new_password: string; confirm_password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password/`, data);
  }

}
