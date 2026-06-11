import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimeService } from '../../services/anime.service';
import { Sidebar } from '../shared/sidebar/sidebar';
import { Topbar } from '../shared/topbar/topbar';
import { AnimeDetail as AnimeDetailData, Episode, Favorite } from '../../models/anime.models';

@Component({
  selector: 'app-anime-detail',
  standalone: true,
  imports: [CommonModule, Sidebar, Topbar], // ✅ Retiré RouterLink (non utilisé)
  templateUrl: './anime-detail.html',
  styleUrl: './anime-detail.css',
})
export class AnimeDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private animeService = inject(AnimeService);

  anime = signal<AnimeDetailData | null>(null);
  episodes = signal<Episode[]>([]);
  loading = signal(true);

  isFavorite = signal(false);
  favoriteId = signal<number | null>(null);
  favLoading = signal(false);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (slug) this.loadData(slug);
    });
  }

  loadData(slug: string): void {
    this.loading.set(true);
    this.animeService.getAnimeDetail(slug).subscribe({
      next: (data) => {
        this.anime.set(data);
        this.animeService.getAnimeEpisodes(slug).subscribe({
          next: (eps) => {
            this.episodes.set(eps);
            this.loading.set(false);
            this.checkIfFavorite();
          },
          error: () => this.loading.set(false),
        });
      },
      error: () => this.loading.set(false),
    });
  }

  checkIfFavorite(): void {
    const currentSlug = this.anime()?.slug;
    if (!currentSlug) return;

    this.animeService.getFavorites().subscribe({
      next: (favs: Favorite[]) => {
        const fav = favs.find((f) => f.anim_detail.slug === currentSlug);
        if (fav) {
          this.isFavorite.set(true);
          this.favoriteId.set(fav.id);
        } else {
          this.isFavorite.set(false);
          this.favoriteId.set(null);
        }
      },
    });
  }
  toggleFavorite(): void {
    if (!this.anime()) return;
    this.favLoading.set(true);

    if (this.isFavorite()) {
      // Supprimer des favoris
      this.animeService.removeFavorite(this.favoriteId()!).subscribe({
        next: () => {
          this.isFavorite.set(false);
          this.favoriteId.set(null);
          this.favLoading.set(false);
        },
        error: () => this.favLoading.set(false),
      });
    } else {
      // Ajouter aux favoris (On passe bien l'ID numérique)
      this.animeService.addFavorite(this.anime()!.id).subscribe({
        next: (newFav: Favorite) => {
          this.isFavorite.set(true);
          this.favoriteId.set(newFav.id);
          this.favLoading.set(false);
        },
        error: (err) => {
          console.error('Erreur ajout favori:', err);
          this.favLoading.set(false);
        },
      });
    }
  }

  watchEpisode(ep: Episode): void {
    // ✅ Nouvelle URL : /anime/:slug/episode/:number
    const slug = this.anime()?.slug;
    if (slug) {
      this.router.navigate(['/anime', slug, 'episode', ep.episode_number]);
    }
  }

  watchFirstEpisode(): void {
    const eps = this.episodes();
    if (eps.length > 0) this.watchEpisode(eps[0]);
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      ongoing: 'En cours',
      completed: 'Terminé',
      upcoming: 'À venir',
      hiatus: 'En pause',
    };
    return labels[status] || status;
  }

  // ✅ Méthodes pour afficher les genres/catégories proprement
  getGenresLabel(genres: string[]): string {
    return genres && genres.length > 0 ? genres.join(', ') : '—';
  }

  getCategoriesLabel(categories: string[]): string {
    return categories && categories.length > 0 ? categories.join(', ') : '—';
  }
}
