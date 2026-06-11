import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimCard } from '../../../models/anime.model';

@Component({
  selector: 'app-anime-card',
  templateUrl: './anime-card.html',
  styleUrl: './anime-card.css',
  standalone: true,
  imports: [CommonModule],
})
export class AnimeCardComponent {
  @Input() anime!: AnimCard;
}
