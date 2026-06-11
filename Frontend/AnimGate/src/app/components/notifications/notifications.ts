import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../shared/sidebar/sidebar';
import { Topbar } from '../shared/topbar/topbar';
import { AnimeService } from '../../services/anime.service';
import { Notification } from '../../models/anime.models';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, Sidebar, Topbar],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications implements OnInit {
  private animeService = inject(AnimeService);

  notifications = signal<Notification[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.animeService.getNotifications().subscribe({
      next: (data) => {
        this.notifications.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  markAsRead(id: number): void {
    this.animeService.markNotificationAsRead(id).subscribe({
      next: () => {
        this.notifications.update((list) =>
          list.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
        );
      },
      error: (err) => console.error('Erreur marquage notification:', err),
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
