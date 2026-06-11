import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  {
    path: 'landing',
    canActivate: [guestGuard],
    loadComponent: () => import('./components/landing/landing').then((m) => m.LandingComponent),
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./components/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./components/register/register').then((m) => m.Register),
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./components/user-home/user-home').then((m) => m.UserHome),
  },
  {
    path: 'anime/:slug',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/anime-detail/anime-detail').then((m) => m.AnimeDetail),
  },
  {
    path: 'anime/:slug/episode/:number',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/episode-view/episode-view').then((m) => m.EpisodeView),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () => import('./components/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'favorites',
    canActivate: [authGuard],
    loadComponent: () => import('./components/favorites/favorites').then((m) => m.Favorites),
  },
  {
    path: 'notifications',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/notifications/notifications').then((m) => m.Notifications),
  },
  {
    path: 'suggestions',
    canActivate: [authGuard],
    loadComponent: () => import('./components/suggestions/suggestions').then((m) => m.Suggestions),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () => import('./components/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'catalog/:filter',
    canActivate: [authGuard],
    loadComponent: () => import('./components/catalog/catalog').then((m) => m.Catalog),
  },
  {
    path: 'continue-watching',
    loadComponent: () =>
      import('./components/continue-watching/continue-watching').then((m) => m.ContinueWatching),
  },
  {
    path: 'watchlist',
    loadComponent: () => import('./components/watchlist/watchlist').then((m) => m.Watchlist),
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/user/profile/profile').then((m) => m.Profile),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: 'landing' },
];
