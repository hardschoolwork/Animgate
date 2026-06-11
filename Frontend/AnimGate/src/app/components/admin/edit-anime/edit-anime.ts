import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { AdminSidebar } from '../../shared/admin-sidebar/admin-sidebar';
import { Topbar } from '../../shared/topbar/topbar';
import { AnimeDetailAdmin } from '../../../models/anime.models';

@Component({
  selector: 'app-edit-anime',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdminSidebar, Topbar],
  templateUrl: './edit-anime.html',
  styleUrl: './edit-anime.css',
})
export class EditAnime implements OnInit {
  private adminService = inject(AdminService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  slug = '';
  loading = signal(true);
  saving = signal(false);
  success = signal(false);
  error = signal('');

  // Champs du formulaire
  title = '';
  title_japanese = '';
  studio = '';
  type = 'series';
  status = 'ongoing';
  age_rating = 'all';
  episode_duration = 24;
  release_year: number | null = null;
  synopsis = '';
  trailer_url = '';

  // ✅ CHAMPS DE MISE EN AVANT
  is_featured = false;

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    this.loadAnime();
  }

  loadAnime(): void {
    this.loading.set(true);
    this.adminService.getAnimeDetail(this.slug).subscribe({
      next: (data: AnimeDetailAdmin) => {
        this.title = data.title;
        this.title_japanese = data.title_japanese || '';
        this.studio = data.studio || '';
        this.type = data.type || 'series';
        this.status = data.status || 'ongoing';
        this.age_rating = data.age_rating || 'all';
        this.episode_duration = data.episode_duration || 24;
        this.release_year = data.release_year;
        this.synopsis = data.synopsis || '';
        this.trailer_url = data.trailer_url || '';

        // ✅ Récupération des états de mise en avant
        this.is_featured = data.is_featured || false;

        this.loading.set(false);
      },
      error: () => {
        this.error.set('Anime introuvable');
        this.loading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (!this.title.trim()) {
      this.error.set('Le titre est obligatoire');
      return;
    }

    this.saving.set(true);
    this.error.set('');

    // ✅ Payload typé pour le PATCH, incluant les booléens
    const payload: Partial<AnimeDetailAdmin> = {
      title: this.title,
      type: this.type,
      status: this.status,
      age_rating: this.age_rating,
      episode_duration: this.episode_duration,
      is_featured: this.is_featured,
    };

    if (this.title_japanese) payload.title_japanese = this.title_japanese;
    if (this.studio) payload.studio = this.studio;
    if (this.release_year !== null) payload.release_year = this.release_year;
    if (this.synopsis) payload.synopsis = this.synopsis;
    if (this.trailer_url) payload.trailer_url = this.trailer_url;

    this.adminService.updateAnime(this.slug, payload).subscribe({
      next: () => {
        this.success.set(true);
        this.saving.set(false);
        setTimeout(() => this.router.navigate(['/admin/dashboard']), 1500);
      },
      error: (err) => {
        console.error('Erreur update:', err);
        this.error.set(err.error ? JSON.stringify(err.error) : 'Erreur lors de la modification');
        this.saving.set(false);
      },
    });
  }
}
