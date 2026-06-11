import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  standalone: true,
  imports: [CommonModule, RouterLink],
})
export class DashboardComponent {
  // Données fictives pour l'exemple, à remplacer par des appels API
  stats = { animes: 842, users: '24.8K', recs: 4, episodes: '12.4K' };
}
