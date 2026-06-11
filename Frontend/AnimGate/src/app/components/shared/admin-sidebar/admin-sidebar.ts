import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Subscription, filter } from 'rxjs';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.css',
})
export class AdminSidebar implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = this.authService.user;
  currentRoute = '';
  private routerSub!: Subscription;

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'bx-home', route: '/admin/dashboard' },
    { label: 'Catalogue', icon: 'bx-movie', route: '/admin/catalogue' },
    { label: 'Ajouter un anime', icon: 'bx-plus-circle', route: '/admin/add' },
  ];

  communityItems: NavItem[] = [
    { label: 'Utilisateurs', icon: 'bx-user', route: '/admin/users' },
    { label: 'Recommandations', icon: 'bx-star', route: '/admin/suggestions' },
    { label: 'Mon Profil', icon: 'bx-user-circle', route: '/profile' }
  ];

  systemItems: NavItem[] = [
    { label: 'Genres & Catégories', icon: 'bx-category', route: '/admin/taxonomies' },
  ];

  ngOnInit(): void {
    this.currentRoute = this.router.url;
    this.routerSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.url;
      });
  }

  ngOnDestroy(): void {
    if (this.routerSub) this.routerSub.unsubscribe();
  }

  getInitials(): string {
    const name = this.user()?.username || 'A';
    return name.charAt(0).toUpperCase();
  }

  logout(): void {
    this.authService.logout();
  }
}
