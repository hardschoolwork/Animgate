import { Routes } from '@angular/router';
import { LandingPage } from './pages/landing-page/landing-page';
import { UserHomeComponent } from './pages/user-home/user-home';
import { AdminLayoutComponent } from './pages/admin/admin-layout/admin-layout';
import { DashboardComponent } from './pages/admin/dashboard/dashboard';
import { CatalogueComponent } from './pages/admin/catalogue/catalogue';
import { AddAnimeComponent } from './pages/admin/add-anime/add-anime';
import { AnimeDetailComponent } from './pages/baseView/anime-detail/anime-detail';
import { EpisodeDetailComponent } from './pages/baseView/episode-detail/episode-detail';

export const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'home', component: UserHomeComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'catalogue', component: CatalogueComponent },
      { path: 'add', component: AddAnimeComponent },
    ],
  },
  { path: 'anime/:slug', component: AnimeDetailComponent },
  { path: 'anime/:slug/episode/:title', component: EpisodeDetailComponent },
  { path: '**', redirectTo: '' },
];
