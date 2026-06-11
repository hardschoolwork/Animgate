import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { AdminSidebar } from '../../shared/admin-sidebar/admin-sidebar';
import { Topbar } from '../../shared/topbar/topbar';

@Component({
  selector: 'app-add-anime',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdminSidebar, Topbar],
  templateUrl: './add-anime.html',
  styleUrl: './add-anime.css'
})
export class AddAnime implements OnInit {
  private adminService = inject(AdminService);
  private router = inject(Router);

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

  // ✅ CHAMPS DE MISE EN AVANT (Réintégrés)
  is_featured = false;
  is_trending = false;

  genres = signal<any[]>([]);
  categories = signal<any[]>([]);
  selectedGenreIds = signal<number[]>([]);
  selectedCategoryIds = signal<number[]>([]);

  coverImage: File | null = null;
  bannerImage: File | null = null;
  coverPreview: string | null = null;
  bannerPreview: string | null = null;

  loading = signal(false);
  success = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.loadOptions();
  }

  loadOptions(): void {
    this.adminService.getGenres().subscribe({
      next: data => this.genres.set(data),
      error: () => console.warn('Genres non chargés')
    });
    this.adminService.getCategories().subscribe({
      next: data => this.categories.set(data),
      error: () => console.warn('Catégories non chargées')
    });
  }

  toggleGenre(id: number): void {
    const current = this.selectedGenreIds();
    this.selectedGenreIds.set(
      current.includes(id) ? current.filter(g => g !== id) : [...current, id]
    );
  }

  toggleCategory(id: number): void {
    const current = this.selectedCategoryIds();
    this.selectedCategoryIds.set(
      current.includes(id) ? current.filter(c => c !== id) : [...current, id]
    );
  }

  onCoverSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.coverImage = input.files[0];
      this.coverPreview = URL.createObjectURL(input.files[0]);
    }
  }

  onBannerSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.bannerImage = input.files[0];
      this.bannerPreview = URL.createObjectURL(input.files[0]);
    }
  }

  onSubmit(): void {
    if (!this.title.trim()) {
      this.error.set('Le titre est obligatoire');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const formData = new FormData();
    formData.append('title', this.title);
    if (this.title_japanese) formData.append('title_japanese', this.title_japanese);
    if (this.studio) formData.append('studio', this.studio);
    formData.append('type', this.type);
    formData.append('status', this.status);
    formData.append('age_rating', this.age_rating);
    formData.append('episode_duration', String(this.episode_duration));
    if (this.release_year !== null) formData.append('release_year', String(this.release_year));
    if (this.synopsis) formData.append('synopsis', this.synopsis);
    if (this.trailer_url) formData.append('trailer_url', this.trailer_url);

    // ✅ ENVOI EXPLICITE DES BOOLÉENS (Django attend 'true' ou 'false' en string dans FormData)
    formData.append('is_featured', this.is_featured ? 'true' : 'false');
    formData.append('is_trending', this.is_trending ? 'true' : 'false');

    // Genres et catégories
    this.selectedGenreIds().forEach(id => formData.append('genre_ids', String(id)));
    this.selectedCategoryIds().forEach(id => formData.append('category_ids', String(id)));

    if (this.coverImage) formData.append('cover_image', this.coverImage);
    if (this.bannerImage) formData.append('banner_image', this.bannerImage);

    this.adminService.createAnime(formData).subscribe({
      next: () => {
        this.success.set(true);
        this.loading.set(false);
        setTimeout(() => this.router.navigate(['/admin/dashboard']), 1500);
      },
      error: (err) => {
        console.error('Erreur création:', err);
        const details = err.error ? JSON.stringify(err.error, null, 2) : 'Erreur inconnue';
        this.error.set(`Erreur 400 : ${details}`);
        this.loading.set(false);
      }
    });
  }
}
