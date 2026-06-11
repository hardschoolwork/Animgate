import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSidebar } from '../../shared/admin-sidebar/admin-sidebar';
import { Topbar } from '../../shared/topbar/topbar';
import { AdminService } from '../../../services/admin.service';
import { Suggestion } from '../../../models/anime.models';
type FilterStatus = 'all' | 'pending' | 'accepted' | 'rejected';
@Component({
  selector: 'app-admin-suggestions',
  standalone: true,
  imports: [CommonModule, AdminSidebar, Topbar],
  templateUrl: './suggestions.html',
  styleUrl: './suggestions.css',
})
export class Suggestions implements OnInit {
  private adminService = inject(AdminService);

  suggestions = signal<Suggestion[]>([]);
  loading = signal(true);
  filterStatus = signal<FilterStatus>('all');
  filterOptions: FilterStatus[] = ['all', 'pending', 'accepted', 'rejected'];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.adminService.getSuggestions().subscribe({
      next: (data) => {
        this.suggestions.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  filteredSuggestions(): Suggestion[] {
    const status = this.filterStatus();
    if (status === 'all') return this.suggestions();
    return this.suggestions().filter((s) => s.state === status);
  }

  handleAction(suggestion: Suggestion, action: 'accepted' | 'rejected'): void {
    this.adminService.updateSuggestionState(suggestion.id, action).subscribe({
      next: () => {
        this.suggestions.update((list) =>
          list.map((s) => (s.id === suggestion.id ? { ...s, state: action } : s)),
        );
      },
    });
  }

  getStateLabel(state: string): string {
    const map: Record<string, string> = {
      pending: 'En attente',
      accepted: 'Accepté',
      rejected: 'Refusé',
    };
    return map[state] || state;
  }
}
