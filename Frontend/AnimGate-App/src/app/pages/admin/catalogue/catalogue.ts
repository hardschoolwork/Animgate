import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.html',
  styleUrl: './catalogue.css',
  standalone: true,
  imports: [CommonModule, RouterLink],
})
export class CatalogueComponent {
  animes = [
    {
      id: 1,
      title: 'Jujutsu Kaisen',
      genres: 'Action, Fantaisie',
      type: 'Série',
      status: 'En cours',
      rating: 9.2,
    },
    {
      id: 2,
      title: 'One Piece',
      genres: 'Aventure, Shonen',
      type: 'Série',
      status: 'En cours',
      rating: 9.5,
    },
    {
      id: 3,
      title: 'Demon Slayer',
      genres: 'Action, Démons',
      type: 'Série',
      status: 'Terminé',
      rating: 9.1,
    },
  ];
}
