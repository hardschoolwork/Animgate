import { Routes } from '@angular/router';
import { EpisodeList } from './episode-list/episode-list';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'anime/:slug/episodes',
    loadComponent: () => import('./episode-list/episode-list').then((m) => m.EpisodeList),
  },
  {
    path: 'catalogue',
    loadComponent: () => import('./catalogue/catalogue').then((m) => m.Catalogue),
  },
  {
    path: 'add',
    loadComponent: () => import('./add-anime/add-anime').then((m) => m.AddAnime),
  },
  {
    path: 'suggestions',
    loadComponent: () => import('./suggestions/suggestions').then((m) => m.Suggestions),
  },
  {
    path: 'edit/:slug',
    loadComponent: () => import('./edit-anime/edit-anime').then((m) => m.EditAnime),
  },
  {
    path: 'taxonomies',
    loadComponent: () =>
      import('./admin-taxonomies/admin-taxonomies').then((m) => m.AdminTaxonomies),
  },
];
