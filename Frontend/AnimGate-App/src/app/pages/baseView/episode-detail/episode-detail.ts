import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AnimeService } from '../../../services/anime';
import { SidebarComponent } from '../../../components/shared/sidebar/sidebar';
import { TopbarComponent } from '../../../components/shared/topbar/topbar';
import { Episode } from '../../../models/anime.model';

@Component({
  selector: 'app-episode-detail',
  templateUrl: './episode-detail.html',
  styleUrl: './episode-detail.css',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent, TopbarComponent],
})
export class EpisodeDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private animeService = inject(AnimeService);

  episode = signal<Episode | null>(null);
  episodesList = signal<Episode[]>([]);
  loading = signal(true);
  prevEp = signal<Episode | null>(null);
  nextEp = signal<Episode | null>(null);

  private routeSub!: Subscription;

  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      const titleParam = params.get('title');
      if (slug && titleParam) {
        this.loadEpisodeByTitle(slug, decodeURIComponent(titleParam));
      }
    });
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
  }

  private loadEpisodeByTitle(animeSlug: string, title: string) {
    this.loading.set(true);
    this.animeService.getAnimeEpisodes(animeSlug).subscribe((list) => {
      const sorted = [...list].sort((a, b) => a.episode_number - b.episode_number);
      this.episodesList.set(sorted);

      const current = sorted.find((e) => e.title === title);
      if (current) {
        this.episode.set(current);
        const idx = sorted.findIndex((e) => e.id === current.id);
        this.prevEp.set(idx > 0 ? sorted[idx - 1] : null);
        this.nextEp.set(idx < sorted.length - 1 ? sorted[idx + 1] : null);
      }
      this.loading.set(false);
    });
  }

  navigateTo(ep: Episode | null) {
    // ✅ Sécurité : on utilise directement ep.anime_slug (déjà hydraté par la liste)
    if (!ep || !ep.anim_slug) return;

    this.router.navigate([
      '/anime',
      ep.anim_slug,
      'episode',
      encodeURIComponent(ep.title)
    ]);
  }
}
