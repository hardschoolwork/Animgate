import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { AdminSidebar } from '../../shared/admin-sidebar/admin-sidebar';
import { Topbar } from '../../shared/topbar/topbar';
import { AnimeCard, Suggestion } from '../../../models/anime.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdminSidebar, Topbar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private adminService = inject(AdminService);
  private router = inject(Router);

  animes = signal<AnimeCard[]>([]);
  suggestions = signal<Suggestion[]>([]);
  loading = signal(true);

  stats = signal({ animes: 0, users: 0, pendingSuggestions: 0, episodes: 0 });
  searchQuery = '';

  // Modal de suppression
  showDeleteModal = signal(false);
  animeToDelete = signal<AnimeCard | null>(null);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);

    this.adminService.getAnimes().subscribe({
      next: (animes) => {
        this.animes.set(animes.slice(0, 10));
        this.stats.update((s) => ({
          ...s,
          animes: animes.length, // On garde le vrai total pour les stats
          episodes: animes.reduce((sum, a) => sum + (a.episodes_count || 0), 0),
        }));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.adminService.getSuggestions().subscribe({
      next: (suggestions) => {
        this.suggestions.set(suggestions.slice(0, 10));
        this.stats.update((s) => ({
          ...s,
          pendingSuggestions: suggestions.filter((s) => s.state === 'pending').length,
        }));
      },
      error: (err) => console.error('Erreur suggestions:', err),
    });
  }

  filteredAnimes(): AnimeCard[] {
    const q = this.searchQuery.toLowerCase();
    return this.animes().filter(
      (a) => a.title.toLowerCase().includes(q) || a.slug.toLowerCase().includes(q),
    );
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      ongoing: 'En cours',
      completed: 'Terminé',
      upcoming: 'À venir',
      hiatus: 'En pause',
    };
    return map[status] || status;
  }

  getStatusClass(status: string): string {
    return status === 'ongoing' ? 'status-ongoing' : 'status-ended';
  }

  getTypeLabel(type?: string): string {
    if (!type) return '—';
    const map: Record<string, string> = {
      series: 'Série',
      movie: 'Film',
      ova: 'OVA',
      ona: 'ONA',
      special: 'Spécial',
    };
    return map[type] || type;
  }

  // Gestion des suggestions
  handleSuggestion(suggestion: Suggestion, action: 'accepted' | 'rejected'): void {
    this.adminService.updateSuggestionState(suggestion.id, action).subscribe({
      next: () => {
        const updated = this.suggestions().map((s) =>
          s.id === suggestion.id ? { ...s, state: action } : s,
        );
        this.suggestions.set(updated);
        this.stats.update((s) => ({
          ...s,
          pendingSuggestions: updated.filter((x) => x.state === 'pending').length,
        }));
      },
      error: (err) => console.error('Erreur action suggestion:', err),
    });
  }

  // Gestion de la modal de suppression
  confirmDelete(anime: AnimeCard): void {
    this.animeToDelete.set(anime);
    this.showDeleteModal.set(true);
  }

  cancelDelete(): void {
    this.showDeleteModal.set(false);
    this.animeToDelete.set(null);
  }

  executeDelete(): void {
    const anime = this.animeToDelete();
    if (!anime) return;

    this.adminService.deleteAnime(anime.slug).subscribe({
      next: () => {
        this.animes.update((list) => list.filter((a) => a.slug !== anime.slug));
        this.stats.update((s) => ({ ...s, animes: s.animes - 1 }));
        this.cancelDelete();
      },
      error: () => {
        alert('Erreur lors de la suppression');
        this.cancelDelete();
      },
    });
  }

  goToAllAnimes(): void {
    console.log('Naviguer vers la liste complète des animes');
  }

  goToAllSuggestions(): void {
    this.router.navigate(['/admin/suggestions']);
  }

  goToEpisodes(slug: string): void {
    this.router.navigate(['/admin/anime', slug, 'episodes']);
  }

  goToEditAnime(slug: string): void {
    this.router.navigate(['/admin/edit', slug]);
  }

  goToAnimeDetail(slug: string): void {
    window.open(`/anime/${slug}`, '_blank');
  }

}
