import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Subscription, filter } from 'rxjs';

// ✅ Définition explicite du type pour les éléments de navigation
interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number; // Le '?' rend la propriété badge optionnelle
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = this.authService.user;
  currentRoute = '';
  private routerSub!: Subscription;

  navItems: NavItem[] = [
    { label: 'Découverte', icon: 'bx-compass', route: '/home' },
    { label: 'Catalogue', icon: 'bx-grid-alt', route: '/catalog/all' }, // ✅ Ajouté ici
    { label: "Films d'animation", icon: 'bx-movie', route: '/catalog/movies' },
    { label: 'Tendances', icon: 'bx-trending-up', route: '/catalog/trending' },
    { label: 'Sorties récentes', icon: 'bx-time', route: '/catalog/new' },
  ];

  myList: NavItem[] = [
    { label: 'Favoris', icon: 'bx-heart', route: '/favorites' },
    { label: 'Continuer', icon: 'bx-history', route: '/continue-watching' },
    { label: 'À regarder', icon: 'bx-bookmark', route: '/watchlist' },
  ];

  settings: NavItem[] = [
    { label: 'Recommandations', icon: 'bx-star', route: '/suggestions' },
    { label: 'Mon Profil', icon: 'bx-user-circle', route: '/profile' },
  ];

  ngOnInit(): void {
    this.currentRoute = this.router.url;

    this.routerSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.url;
      });

    if (!this.user()) {
      this.authService.getProfile().subscribe();
    }
  }

  ngOnDestroy(): void {
    if (this.routerSub) this.routerSub.unsubscribe();
  }

  getInitials(): string {
    const name = this.user()?.username || 'U';
    return name.charAt(0).toUpperCase();
  }

  getDisplayName(): string {
    return this.user()?.username || 'Utilisateur';
  }

  logout(): void {
    this.authService.logout();
  }
}
