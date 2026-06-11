import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AnimeService } from '../../../services/anime.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar implements OnInit {
  // ✅ CHANGER 'private' EN 'protected' POUR QU'ILS SOIENT ACCESSIBLES DANS LE HTML
  protected authService = inject(AuthService);
  protected animeService = inject(AnimeService);
  private router = inject(Router); // Celui-ci peut rester private car on ne l'utilise que dans le TS

  searchQuery = '';
  hasUnreadNotifications = signal(false);

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.checkUnreadNotifications();
    }
  }

  checkUnreadNotifications(): void {
    this.animeService.getNotifications().subscribe({
      next: (notifs) => {
        this.hasUnreadNotifications.set(notifs.some((n) => !n.is_read));
      },
      error: () => this.hasUnreadNotifications.set(false),
    });
  }

  getInitials(): string {
    const name = this.authService.user()?.username || 'U';
    return name.charAt(0).toUpperCase();
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/catalog', 'all'], {
        queryParams: { search: this.searchQuery.trim() },
      });
      this.searchQuery = '';
    }
  }
}
