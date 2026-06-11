import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class LandingComponent {
  stats = [
    { number: '12K+', label: 'Épisodes', icon: 'bx-video' },
    { number: '800+', label: 'Séries', icon: 'bx-collection' },
    { number: '50+', label: 'Genres', icon: 'bx-category-alt' },
    { number: '4K', label: 'Qualité', icon: 'bx-hd' }
  ];

  featured = [
    { icon: 'bx-water', genre: 'Aventure', title: 'One Piece', badge: 'Trending', badgeClass: 'red' },
    { icon: 'bx-sword', genre: 'Action · Fantaisie', title: 'Jujutsu Kaisen', badge: 'Nouveau', badgeClass: 'yellow' },
    { icon: 'bx-fire', genre: 'Action', title: 'Demon Slayer', badge: 'VF Dispo', badgeClass: 'blue' }
  ];

  infoFeatures = [
    { icon: 'bx-play-circle', title: 'Streaming HD', desc: '1080p & 4K' },
    { icon: 'bx-world', title: 'Multi-langue', desc: 'VOSTFR, VF, EN' },
    { icon: 'bx-bell', title: 'Alertes', desc: 'Nouveaux épisodes' },
    { icon: 'bx-list-ul', title: 'Ma liste', desc: 'Favoris & Récents' }
  ];
}
