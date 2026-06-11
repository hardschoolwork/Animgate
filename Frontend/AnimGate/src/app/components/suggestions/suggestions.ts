import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../shared/sidebar/sidebar';
import { Topbar } from '../shared/topbar/topbar';
import { AnimeService } from '../../services/anime.service';
import { Suggestion } from '../../models/anime.models';

@Component({
  selector: 'app-suggestions',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Topbar],
  templateUrl: './suggestions.html',
  styleUrl: './suggestions.css',
})
export class Suggestions implements OnInit {
  private animeService = inject(AnimeService);

  suggestions = signal<Suggestion[]>([]);
  loading = signal(true);

  // Formulaire de nouvelle suggestion
  suggested_anim = '';
  message = '';
  submitting = signal(false);

  ngOnInit(): void {
    this.loadSuggestions();
  }

  loadSuggestions(): void {
    this.animeService.getSuggestions().subscribe({
      next: (data) => {
        this.suggestions.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  submitSuggestion(): void {
    if (!this.suggested_anim.trim() || !this.message.trim()) {
      return;
    }

    this.submitting.set(true);
    this.animeService.submitSuggestion(this.suggested_anim, this.message).subscribe({
      next: (newSuggestion) => {
        this.suggestions.update((list) => [newSuggestion, ...list]);
        this.suggested_anim = '';
        this.message = '';
        this.submitting.set(false);
      },
      error: (err) => {
        console.error('Erreur soumission suggestion:', err);
        this.submitting.set(false);
      },
    });
  }

  getStateLabel(state: string): string {
    const labels: Record<string, string> = {
      pending: 'En attente',
      accepted: 'Accepté',
      rejected: 'Refusé',
    };
    return labels[state] || state;
  }

  getStateClass(state: string): string {
    return `state-${state}`;
  }
}
