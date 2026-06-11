import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Sidebar } from '../shared/sidebar/sidebar';
import { Topbar } from '../shared/topbar/topbar';
import { SectionBlock } from '../shared/section-block/section-block'; // ✅ AJOUTÉ
import { AnimeService } from '../../services/anime.service';
import { HomeFeed } from '../../models/anime.models';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    Sidebar,
    Topbar,
    SectionBlock,
  ],
  templateUrl: './user-home.html',
  styleUrl: './user-home.css',
})
export class UserHome implements OnInit {
  private animeService = inject(AnimeService);

  feed = signal<HomeFeed | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    this.loadFeed();
  }

  loadFeed(): void {
    this.animeService.getHomeFeed().subscribe({
      next: (data) => {
        this.feed.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement feed:', err);
        this.loading.set(false);
      },
    });
  }
}
