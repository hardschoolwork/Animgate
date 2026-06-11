import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnimDetail, Episode, HomeFeed } from '../models/anime.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AnimeService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getHomeFeed(): Observable<HomeFeed> {
    return this.http.get<HomeFeed>(`${this.baseUrl}/home/feed/`);
  }

  getAnimeDetail(slug: string): Observable<AnimDetail> {
    return this.http.get<AnimDetail>(`${this.baseUrl}/anims/${slug}/`);
  }

  getAnimeEpisodes(slug: string): Observable<Episode[]> {
    return this.http.get<Episode[]>(`${this.baseUrl}/anims/${slug}/episodes/`);
  }

  getEpisodeDetail(id: number): Observable<Episode> {
    return this.http.get<Episode>(`${this.baseUrl}/anim/episode/${id}/`);
  }
}
