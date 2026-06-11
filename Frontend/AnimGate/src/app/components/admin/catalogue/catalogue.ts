import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { AdminSidebar } from '../../shared/admin-sidebar/admin-sidebar';
import { Topbar } from '../../shared/topbar/topbar';
import { AnimeCard } from '../../../models/anime.models';

@Component({
  selector: 'app-admin-catalogue',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebar, Topbar],
  templateUrl: './catalogue.html',
  styleUrl: './catalogue.css',
})
export class Catalogue implements OnInit {
  private adminService = inject(AdminService);
  private router = inject(Router);

  animes = signal<AnimeCard[]>([]);
  loading = signal(true);
  searchQuery = '';

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.adminService.getAnimes().subscribe({
      next: (data) => {
        this.animes.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  filteredAnimes(): AnimeCard[] {
    const q = this.searchQuery.toLowerCase();
    return this.animes().filter(
      (a) => a.title.toLowerCase().includes(q) || a.slug.toLowerCase().includes(q),
    );
  }

  goToEpisodes(slug: string): void {
    this.router.navigate(['/admin/anime', slug, 'episodes']);
  }
  goToEdit(slug: string): void {
    this.router.navigate(['/admin/edit', slug]);
  }

  deleteAnime(slug: string): void {
    if (confirm('Supprimer cet anime définitivement ?')) {
      this.adminService.deleteAnime(slug).subscribe({
        next: () => this.animes.update((list) => list.filter((a) => a.slug !== slug)),
        error: () => alert('Erreur lors de la suppression'),
      });
    }
  }
}
