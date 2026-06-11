// topbar.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavStateService } from '../../../services/nav-state';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
  standalone: true,
  imports: [CommonModule],
})
export class TopbarComponent {
  nav = inject(NavStateService);
  onSearch(e: Event) {
    this.nav.setSearch((e.target as HTMLInputElement).value.trim());
  }
}
