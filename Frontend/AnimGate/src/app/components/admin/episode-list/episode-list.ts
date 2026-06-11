import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { AdminSidebar } from '../../shared/admin-sidebar/admin-sidebar';
import { Topbar } from '../../shared/topbar/topbar';
import { Episode, AnimeDetailAdmin } from '../../../models/anime.models';

@Component({
  selector: 'app-episode-list',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebar, Topbar],
  templateUrl: './episode-list.html',
  styleUrl: './episode-list.css'
})
export class EpisodeList implements OnInit {
  private adminService = inject(AdminService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  slug = '';
  animId = signal<number | null>(null); // ✅ AJOUTÉ : Pour stocker l'ID numérique
  animeTitle = signal<string>('');      // ✅ AJOUTÉ : Pour afficher le titre dans le header
  episodes = signal<Episode[]>([]);
  loading = signal(true);

  showForm = signal(false);
  isEditing = signal(false);
  editingId = signal<number | null>(null);

  episode_number = 1;
  title = '';
  description = '';
  duration_minutes = 24;
  release_date = '';
  is_filler = false;
  episode_video: File | null = null;
  thumbnail: File | null = null;
  videoPreview = '';
  thumbnailPreview = '';

  formLoading = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    this.loadAnimeData();
  }

  // ✅ NOUVELLE MÉTHODE : Récupère l'ID et le titre de l'anime avant de charger les épisodes
  loadAnimeData(): void {
    this.loading.set(true);
    this.adminService.getAnimeDetail(this.slug).subscribe({
      next: (anime: AnimeDetailAdmin) => {
        this.animId.set(anime.id);
        this.animeTitle.set(anime.title);
        this.loadEpisodesList();
      },
      error: () => {
        this.error.set('Anime introuvable');
        this.loading.set(false);
      }
    });
  }

  loadEpisodesList(): void {
    this.adminService.getAnimeEpisodes(this.slug).subscribe({
      next: (data) => {
        this.episodes.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  openAddForm(): void {
    this.resetForm();
    this.isEditing.set(false);
    this.showForm.set(true);
  }

  openEditForm(ep: Episode): void {
    this.resetForm();
    this.isEditing.set(true);
    this.editingId.set(ep.id);
    this.episode_number = ep.episode_number;
    this.title = ep.title;
    this.duration_minutes = ep.duration_minutes || 24;
    this.release_date = ep.release_date ? ep.release_date.split('T')[0] : '';
    this.is_filler = ep.is_filler || false;
    this.showForm.set(true);
  }

  resetForm(): void {
    this.episode_number = 1;
    this.title = '';
    this.description = '';
    this.duration_minutes = 24;
    this.release_date = '';
    this.is_filler = false;
    this.episode_video = null;
    this.thumbnail = null;
    this.videoPreview = '';
    this.thumbnailPreview = '';
    this.error.set('');
  }

  onVideoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.episode_video = input.files[0];
      this.videoPreview = URL.createObjectURL(input.files[0]);
    }
  }

  onThumbnailSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.thumbnail = input.files[0];
      this.thumbnailPreview = URL.createObjectURL(input.files[0]);
    }
  }

  submitForm(): void {
    if (!this.title.trim()) {
      this.error.set('Le titre de l\'épisode est obligatoire');
      return;
    }

    if (!this.animId()) {
      this.error.set('ID de l\'anime introuvable');
      return;
    }

    this.formLoading.set(true);
    const formData = new FormData();

    // ✅ CORRECTION DÉFINITIVE : On envoie l'ID numérique, pas le slug
    formData.append('anim', String(this.animId()));

    formData.append('episode_number', String(this.episode_number));
    formData.append('title', this.title);

    if (this.description) formData.append('description', this.description);
    formData.append('duration_minutes', String(this.duration_minutes));
    if (this.release_date) formData.append('release_date', this.release_date);

    formData.append('is_filler', this.is_filler ? 'true' : 'false');

    if (this.episode_video) formData.append('episode_video', this.episode_video);
    if (this.thumbnail) formData.append('thumbnail', this.thumbnail);

    const request = this.isEditing() && this.editingId()
      ? this.adminService.updateEpisode(this.editingId()!, formData)
      : this.adminService.createEpisode(formData);

    request.subscribe({
      next: () => {
        this.showForm.set(false);
        this.loadEpisodesList();
      },
      error: (err) => {
        console.error('❌ Détail de l\'erreur:', err.error);
        this.error.set(err.error ? JSON.stringify(err.error) : 'Erreur lors de l\'enregistrement');
        this.formLoading.set(false);
      }
    });
  }

  deleteEpisode(id: number): void {
    if (confirm('Supprimer cet épisode définitivement ?')) {
      this.adminService.deleteEpisode(id).subscribe({
        next: () => this.loadEpisodesList(),
        error: () => alert('Erreur lors de la suppression')
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}
