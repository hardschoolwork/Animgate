// sidebar.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavStateService, Tab } from '../../../services/nav-state';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  standalone: true,
  imports: [CommonModule],
})
export class SidebarComponent {
  nav = inject(NavStateService);
  navItems: { id: Tab; label: string; icon: string }[] = [
    { id: 'discover', label: 'Découverte', icon: 'fa-compass' },
    { id: 'movies', label: "Films d'animation", icon: 'fa-film' },
    { id: 'trending', label: 'Tendances', icon: 'fa-arrow-trend-up' },
    { id: 'new', label: 'Sorties récentes', icon: 'fa-clock' },
    { id: 'planning', label: 'Planning', icon: 'fa-calendar-alt' },
  ];
}
