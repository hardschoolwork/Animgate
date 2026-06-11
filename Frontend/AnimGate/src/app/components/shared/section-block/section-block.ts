import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HomeSection, AnimeCard, AnimeSlide } from '../../../models/anime.models';

@Component({
  selector: 'app-section-block',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './section-block.html',
  styleUrl: './section-block.css',
})
export class SectionBlock {
  @Input() section!: HomeSection;
  @Input() title = '';
  @Input() items: AnimeCard[] = [];

  // ✅ Ce lien est fourni par user-home.html
  @Input() viewMoreLink = '/catalog/all';

  currentSlideIndex = 0;

  get currentSlide(): AnimeSlide | null {
    return this.section?.slides?.[this.currentSlideIndex] || null;
  }

  nextSlide(): void {
    if (!this.section.slides) return;
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.section.slides.length;
  }

  prevSlide(): void {
    if (!this.section.slides) return;
    this.currentSlideIndex =
      (this.currentSlideIndex - 1 + this.section.slides.length) % this.section.slides.length;
  }

  goToSlide(index: number): void {
    this.currentSlideIndex = index;
  }
  constructor(private router: Router) {}

  goToFirstEpisode(slug: string): void {
    this.router.navigate(['/anime', slug]);
  }
}
