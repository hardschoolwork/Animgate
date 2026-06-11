import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../services/admin';

@Component({
  selector: 'app-add-anime',
  templateUrl: './add-anime.html',
  styleUrl: './add-anime.css',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
})
export class AddAnimeComponent implements OnInit {
  private adminService = inject(AdminService);

  // Listes récupérées depuis l'API
  genresList: any[] = [];
  categoriesList: any[] = [];

  // Données du formulaire
  form = {
    title: '',
    title_japanese: '',
    title_english: '',
    studio: '',
    type: 'series',
    status: 'ongoing',
    age_rating: 'all',
    total_episodes: 12,
    episode_duration: 24,
    release_year: new Date().getFullYear(),
    synopsis: '',
    genre_ids: [] as number[],
    category_ids: [] as number[],
    trailer_url: '',
    is_featured: false,
    is_trending: false,
    is_new_release: false,
  };

  coverFile: File | null = null;
  bannerFile: File | null = null;

  ngOnInit() {
    this.loadOptions();
  }

  loadOptions() {
    this.adminService.getGenres().subscribe((res) => (this.genresList = res));
    this.adminService.getCategories().subscribe((res) => (this.categoriesList = res));
  }

  onFileChange(event: any, type: 'cover' | 'banner') {
    const file = event.target.files[0];
    if (file) type === 'cover' ? (this.coverFile = file) : (this.bannerFile = file);
  }

  onSubmit() {
    const formData = new FormData();

    // Champs texte
    Object.entries(this.form).forEach(([key, value]) => {
      if (value === '' || value === null) return;
      // Pour les tableaux d'IDs (genre_ids, category_ids), on les ajoute un par un
      if (Array.isArray(value)) {
        value.forEach((id) => formData.append(key, String(id)));
      } else if (typeof value === 'boolean') {
        formData.append(key, value ? 'true' : 'false');
      } else {
        formData.append(key, String(value));
      }
    });

    if (this.coverFile) formData.append('cover_image', this.coverFile);
    if (this.bannerFile) formData.append('banner_image', this.bannerFile);

    this.adminService.createAnime(formData).subscribe({
      next: () => alert('Anime créé !'),
      error: (err) => console.error(err),
    });
  }
}
