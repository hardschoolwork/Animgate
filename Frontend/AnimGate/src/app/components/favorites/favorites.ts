import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnimeService } from '../../services/anime.service';
import { Sidebar } from '../shared/sidebar/sidebar';
import { Topbar } from '../shared/topbar/topbar';
import { Favorite } from '../../models/anime.models';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink, Sidebar, Topbar],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites implements OnInit {
  private animeService = inject(AnimeService);

  favorites = signal<Favorite[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.animeService.getFavorites().subscribe({
      next: (data) => {
        this.favorites.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  removeFavorite(id: number): void {
    this.animeService.removeFavorite(id).subscribe({
      next: () => {
        this.favorites.update((list) => list.filter((f) => f.id !== id));
      },
      error: (err) => console.error('Erreur suppression favori:', err),
    });
  }
}
