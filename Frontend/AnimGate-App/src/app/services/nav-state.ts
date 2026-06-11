// src/app/services/nav-state.service.ts
import { Injectable, signal, computed } from '@angular/core';

export type Tab = 'discover' | 'movies' | 'trending' | 'new' | 'planning';

@Injectable({ providedIn: 'root' })
export class NavStateService {
  activeTab = signal<Tab>('discover');
  searchQuery = signal('');
  isSidebarOpen = signal(false); // ✅ Nouveau

  searchPlaceholder = computed(() => {
    const tab = this.activeTab();
    if (tab === 'movies') return 'Rechercher un film...';
    if (tab === 'trending') return 'Rechercher dans les tendances...';
    if (tab === 'new') return 'Rechercher une nouveauté...';
    return 'Rechercher un anime, film, studio...';
  });

  setTab(tab: Tab) { this.activeTab.set(tab); }
  setSearch(q: string) { this.searchQuery.set(q); }
  toggleSidebar() { this.isSidebarOpen.update(v => !v); }
  closeSidebar() { this.isSidebarOpen.set(false); }
}
