import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/shared/sidebar/sidebar';
import { TopbarComponent } from '../../components/shared/topbar/topbar';
import { SliderComponent } from '../../components/shared/slider/slider';
import { AnimeCardComponent } from '../../components/shared/anime-card/anime-card';
import { AnimeService } from '../../services/anime';
import { HomeFeed } from '../../models/anime.model';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.html',
  styleUrl: './user-home.css',
  standalone: true,
  imports: [CommonModule, SidebarComponent, TopbarComponent, SliderComponent, AnimeCardComponent],
})
export class UserHomeComponent implements OnInit {
  feed = signal<HomeFeed | null>(null);
  private animeService = inject(AnimeService);

  ngOnInit() {
    this.animeService.getHomeFeed().subscribe({
      next: (data) => this.feed.set(data),
      error: (err) => console.error('Erreur chargement:', err),
    });
  }
}
