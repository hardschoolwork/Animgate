import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  // Récupérer la liste des genres pour le formulaire
  getGenres(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/genres/`); // Adapte le chemin si besoin
  }

  // Récupérer la liste des catégories pour le formulaire
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/categories/`); // Adapte le chemin si besoin
  }

  createAnime(formData: FormData): Observable<any> {
    return this.http.post(`${this.api}/admin/anims/`, formData);
  }
}
