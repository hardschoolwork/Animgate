import { Component, inject, OnInit, OnDestroy, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AnimeService } from '../../services/anime.service';
import { Sidebar } from '../shared/sidebar/sidebar';
import { Topbar } from '../shared/topbar/topbar';
import { EpisodeDetail, Episode } from '../../models/anime.models';

@Component({
  selector: 'app-episode-view',
  standalone: true,
  imports: [CommonModule, RouterLink, Sidebar, Topbar],
  templateUrl: './episode-view.html',
  styleUrl: './episode-view.css',
})
export class EpisodeView implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private animeService = inject(AnimeService);

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('progressBar') progressBar!: ElementRef<HTMLInputElement>;

  episode = signal<EpisodeDetail | null>(null);
  episodesList = signal<Episode[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  prevEp = signal<Episode | null>(null);
  nextEp = signal<Episode | null>(null);

  // ✅ AJOUTÉ : Pour correspondre à ton fichier HTML
  animSlug = '';

  // État du lecteur
  isPlaying = signal(false);
  currentTime = signal(0);
  duration = signal(0);
  volume = signal(1);
  isFullscreen = signal(false);

  private routeSub!: Subscription;

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      const number = params.get('number');

      if (slug && number) {
        this.animSlug = slug;
        this.error.set(null);
        this.loadEpisodeByNumber(slug, Number(number));
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) this.routeSub.unsubscribe();
  }

  loadEpisodeByNumber(slug: string, episodeNumber: number): void {
    this.loading.set(true);

    this.animeService.getAnimeEpisodes(slug).subscribe({
      next: (list) => {
        const sorted = [...list].sort((a, b) => a.episode_number - b.episode_number);
        this.episodesList.set(sorted);

        const target = sorted.find((e) => e.episode_number === episodeNumber);

        if (!target) {
          this.error.set(`Épisode ${episodeNumber} introuvable pour cet anime.`);
          this.loading.set(false);
          return;
        }

        this.animeService.getEpisodeDetail(target.id).subscribe({
          next: (ep) => {
            this.episode.set(ep);
            const idx = sorted.findIndex((e) => e.id === target.id);
            this.prevEp.set(idx > 0 ? sorted[idx - 1] : null);
            this.nextEp.set(idx < sorted.length - 1 ? sorted[idx + 1] : null);
            this.loading.set(false);
          },
          error: (err) => {
            console.error('❌ Erreur API détail épisode:', err);
            this.error.set(`Impossible de charger les détails de l'épisode.`);
            this.loading.set(false);
          },
        });
      },
      error: (err) => {
        console.error('❌ Erreur API liste épisodes:', err);
        this.error.set('Impossible de charger les épisodes de cet anime.');
        this.loading.set(false);
      },
    });
  }

  // === CONTRÔLES VIDÉO ===
  get video(): HTMLVideoElement {
    return this.videoPlayer?.nativeElement;
  }

  togglePlay(): void {
    if (!this.video) return;
    if (this.video.paused) {
      this.video.play();
      this.isPlaying.set(true);
    } else {
      this.video.pause();
      this.isPlaying.set(false);
    }
  }

  onTimeUpdate(): void {
    if (!this.video) return;
    this.currentTime.set(this.video.currentTime);
  }

  onLoadedMetadata(): void {
    if (!this.video) return;
    this.duration.set(this.video.duration);
  }

  onProgressClick(event: MouseEvent | Event): void {
    if (!this.video || !this.video.duration || isNaN(this.video.duration)) return;

    // Empêche tout comportement par défaut ou propagation indésirable
    event.preventDefault();
    event.stopPropagation();

    const mouseEvent = event as MouseEvent;
    const bar = this.progressBar?.nativeElement;
    if (!bar) return;

    const rect = bar.getBoundingClientRect();
    // Calcul précis de la position de la souris par rapport à la barre
    const clickX = mouseEvent.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));

    // Application du nouveau temps
    this.video.currentTime = percent * this.video.duration;
    this.currentTime.set(this.video.currentTime);
  }

  skip(seconds: number): void {
    if (!this.video || !this.video.duration) return;
    this.video.currentTime = Math.max(
      0,
      Math.min(this.video.duration, this.video.currentTime + seconds),
    );
  }

  onVolumeChange(event: Event): void {
    if (!this.video) return;
    const val = (event.target as HTMLInputElement).value;
    this.volume.set(parseFloat(val));
    this.video.volume = this.volume();
  }

  toggleFullscreen(): void {
    const container = this.videoPlayer?.nativeElement?.parentElement;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err) => console.error(err));
      this.isFullscreen.set(true);
    } else {
      document.exitFullscreen();
      this.isFullscreen.set(false);
    }
  }

  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  get progressPercent(): number {
    return this.duration() ? (this.currentTime() / this.duration()) * 100 : 0;
  }

  // === NAVIGATION ===
  navigateTo(ep: Episode | null): void {
    if (ep && this.animSlug) {
      this.router.navigate(['/anime', this.animSlug, 'episode', ep.episode_number]);
    }
  }

  share(): void {
    if (navigator.share) {
      navigator.share({ title: this.episode()?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié !');
    }
  }

  saveProgress(isCompleted: boolean = false): void {
    if (!this.episode() || !this.video || !this.video.duration) return;

    const progress = (this.video.currentTime / this.video.duration) * 100;


    if (progress > 5 || isCompleted) {
      this.animeService.saveWatchProgress(this.episode()!.id, progress, isCompleted).subscribe({
        next: () => console.log('Progression sauvegardée'),
        error: (err) => console.error('Erreur sauvegarde progression:', err),
      });
    }
  }


  onVideoPause(): void {
    this.isPlaying.set(false);
    this.saveProgress(false);
  }

  onVideoEnded(): void {
    this.isPlaying.set(false);
    this.saveProgress(true);
  }

}
