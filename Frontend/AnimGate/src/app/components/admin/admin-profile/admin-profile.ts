// admin-profile.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AdminSidebar } from '../../shared/admin-sidebar/admin-sidebar';
import { Topbar } from '../../shared/topbar/topbar';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, AdminSidebar, Topbar],
  template: `
    <div class="app">
      <app-admin-sidebar></app-admin-sidebar>
      <main class="main">
        <app-topbar></app-topbar>
        <div class="profile-card">
          <div class="avatar-large">{{ authService.user()?.username?.charAt(0) || 'A' }}</div>
          <h2>{{ authService.user()?.username || 'Admin' }}</h2>
          <p class="role">Super Administrateur</p>
          <p class="email">{{ authService.user()?.email || 'admin@aniverse.com' }}</p>
          <button class="btn-logout" (click)="authService.logout(); router.navigate(['/landing'])">
            <i class="bx bx-log-out"></i> Se déconnecter
          </button>
        </div>
      </main>
    </div>
  `,
  styles: [
    `
      .app {
        display: flex;
        min-height: 100vh;
        background: var(--bg);
      }
      .main {
        margin-left: 240px;
        padding: 40px;
        width: calc(100% - 240px);
        display: flex;
        justify-content: center;
      }
      .profile-card {
        background: var(--panel);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 40px;
        text-align: center;
        width: 100%;
        max-width: 400px;
      }
      .avatar-large {
        width: 80px;
        height: 80px;
        background: var(--accent);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        font-weight: 700;
        color: #fff;
        margin: 0 auto 20px;
      }
      h2 {
        margin: 0 0 8px;
        font-size: 24px;
      }
      .role {
        color: #ffb800;
        font-weight: 600;
        margin-bottom: 8px;
      }
      .email {
        color: var(--text2);
        margin-bottom: 32px;
      }
      .btn-logout {
        background: rgba(230, 32, 32, 0.1);
        color: #e62020;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        transition: 0.2s;
      }
      .btn-logout:hover {
        background: #e62020;
        color: #fff;
      }
      @media (max-width: 1024px) {
        .main {
          margin-left: 0;
          width: 100%;
        }
      }
    `,
  ],
})
export class AdminProfile {
  authService = inject(AuthService);
  router = inject(Router);
}
