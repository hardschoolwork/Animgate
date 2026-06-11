import { Component, Input, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimSlide } from '../../../models/anime.model'; // <-- Changement ici

@Component({
  selector: 'app-slider',
  templateUrl: './slider.html',
  styleUrl: './slider.css',
  standalone: true,
  imports: [CommonModule],
})
export class SliderComponent implements OnInit, OnDestroy {
  @Input() items: AnimSlide[] = []; // <-- Type strict aligné sur AnimSliderSerializer
  @Input() height = '380px';
  currentIndex = signal(0);
  private interval: any;

  ngOnInit() {
    this.startAutoplay();
  }
  ngOnDestroy() {
    clearInterval(this.interval);
  }
  startAutoplay() {
    this.interval = setInterval(() => this.next(), 6000);
  }
  next() {
    this.currentIndex.set((this.currentIndex() + 1) % this.items.length);
  }
  prev() {
    this.currentIndex.set((this.currentIndex() - 1 + this.items.length) % this.items.length);
  }
  goTo(i: number) {
    this.currentIndex.set(i);
    clearInterval(this.interval);
    this.startAutoplay();
  }
}
