import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AnimeService } from '../../services/anime.service';
import { Sidebar } from '../shared/sidebar/sidebar';
import { Topbar } from '../shared/topbar/topbar';
import { AnimeCard } from '../../models/anime.models';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink, Sidebar, Topbar],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog implements OnInit {
  private animeService = inject(AnimeService);
  private route = inject(ActivatedRoute);

  animes = signal<AnimeCard[]>([]);
  loading = signal(true);
  pageTitle = signal('Catalogue');
  searchQuery = '';

  ngOnInit(): void {
    // Écoute les changements de paramètres d'URL et de requête
    this.route.paramMap.subscribe(() => this.loadAnimes());
    this.route.queryParamMap.subscribe(() => this.loadAnimes());
  }

  loadAnimes(): void {
    this.loading.set(true);
    const filter = this.route.snapshot.paramMap.get('filter') || 'all';
    const search = this.route.snapshot.queryParamMap.get('search') || '';

    this.searchQuery = search;
    let params: any = {};

    if (search) {
      this.pageTitle.set(`Résultats pour "${search}"`);
      params = { search: search };
    } else {
      switch (filter) {
        case 'movies':
          this.pageTitle.set("Films d'animation");
          params = { type: 'movie' };
          break;
        case 'trending':
          this.pageTitle.set('Tendances');
          params = { is_trending: true };
          break;
        case 'new':
          this.pageTitle.set('Sorties récentes');
          params = { is_new_release: true };
          break;
        default:
          this.pageTitle.set('Tous les animes');
      }
    }

    this.animeService.getAnimes(params).subscribe({
      next: (response: any) => {
        if (response.results && Array.isArray(response.results)) {
          this.animes.set(response.results);
        } else {
          this.animes.set([]);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
