import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AnimeService } from '../../../services/anime';
import { SidebarComponent } from '../../../components/shared/sidebar/sidebar';
import { TopbarComponent } from '../../../components/shared/topbar/topbar';
import { AnimDetail, Episode } from '../../../models/anime.model';

@Component({
  selector: 'app-anime-detail',
  templateUrl: './anime-detail.html',
  styleUrl: './anime-detail.css',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent, TopbarComponent],
})
export class AnimeDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private animeService = inject(AnimeService);

  anime = signal<AnimDetail | null>(null);
  episodes = signal<Episode[]>([]);
  loading = signal(true);

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) this.loadAnime(slug);
  }

  loadAnime(slug: string) {
    this.loading.set(true);
    this.animeService.getAnimeDetail(slug).subscribe({
      next: (data) => {
        this.anime.set(data);
        this.animeService.getAnimeEpisodes(slug).subscribe((eps) => this.episodes.set(eps));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  watchEpisode(ep: Episode | undefined) {
    if (!ep || !this.anime()) return;
    this.router.navigate(['/anime', this.anime()!.slug, 'episode', encodeURIComponent(ep.title)]);
  }
}
