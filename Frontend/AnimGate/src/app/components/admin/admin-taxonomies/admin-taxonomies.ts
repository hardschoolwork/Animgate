import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSidebar } from '../../shared/admin-sidebar/admin-sidebar';
import { Topbar } from '../../shared/topbar/topbar';
import { AdminService } from '../../../services/admin.service';
import { Genre, Category } from '../../../models/anime.models';

@Component({
  selector: 'app-admin-taxonomies',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebar, Topbar],
  templateUrl: './admin-taxonomies.html',
  styleUrl: './admin-taxonomies.css',
})
export class AdminTaxonomies implements OnInit {
  private adminService = inject(AdminService);

  genres = signal<Genre[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(true);

  newGenreName = '';
  newCategoryName = '';
  addingGenre = signal(false);
  addingCategory = signal(false);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.adminService.getGenres().subscribe({
      next: (data) => {
        this.genres.set(data);
        this.checkLoading();
      },
    });
    this.adminService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.checkLoading();
      },
    });
  }

  private checkLoading(): void {
    // Astuce simple pour savoir quand les deux requêtes sont finies
    if (this.genres().length >= 0 && this.categories().length >= 0) {
      this.loading.set(false);
    }
  }

  addGenre(): void {
    if (!this.newGenreName.trim()) return;
    this.addingGenre.set(true);
    this.adminService.createGenre(this.newGenreName.trim()).subscribe({
      next: () => {
        this.newGenreName = '';
        this.addingGenre.set(false);
        this.adminService.getGenres().subscribe((data) => this.genres.set(data));
      },
      error: () => this.addingGenre.set(false),
    });
  }

  deleteGenre(id: number): void {
    if (confirm('Supprimer ce genre ?')) {
      this.adminService.deleteGenre(id).subscribe({
        next: () => this.genres.update((list) => list.filter((g) => g.id !== id)),
      });
    }
  }

  addCategory(): void {
    if (!this.newCategoryName.trim()) return;
    this.addingCategory.set(true);
    this.adminService.createCategory(this.newCategoryName.trim()).subscribe({
      next: () => {
        this.newCategoryName = '';
        this.addingCategory.set(false);
        this.adminService.getCategories().subscribe((data) => this.categories.set(data));
      },
      error: () => this.addingCategory.set(false),
    });
  }

  deleteCategory(id: number): void {
    if (confirm('Supprimer cette catégorie ?')) {
      this.adminService.deleteCategory(id).subscribe({
        next: () => this.categories.update((list) => list.filter((c) => c.id !== id)),
      });
    }
  }
}
