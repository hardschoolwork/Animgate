// admin-settings.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSidebar } from '../../shared/admin-sidebar/admin-sidebar';
import { Topbar } from '../../shared/topbar/topbar';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, AdminSidebar, Topbar],
  template: `
    <div class="app">
      <app-admin-sidebar></app-admin-sidebar>
      <main class="main">
        <app-topbar></app-topbar>
        <div class="page-header">
          <h2><i class="bx bx-cog"></i> Configuration Système</h2>
        </div>
        <div class="settings-grid">
          <div class="setting-card">
            <h3>État de l'API</h3>
            <p class="status-ok"><i class="bx bx-check-circle"></i> Opérationnel</p>
          </div>
          <div class="setting-card">
            <h3>Version du Backend</h3>
            <p>Django 4.x / DRF</p>
          </div>
          <div class="setting-card">
            <h3>Base de données</h3>
            <p>Connectée</p>
          </div>
        </div>
        <div class="info-box">
          <i class="bx bx-info-circle"></i>
          <p>
            La gestion avancée des utilisateurs et des paramètres globaux sera disponible
            prochainement via les endpoints dédiés.
          </p>
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
        padding: 24px 32px;
        width: calc(100% - 240px);
      }
      .page-header {
        margin-bottom: 24px;
      }
      .page-header h2 {
        font-size: 22px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .page-header h2 i {
        color: var(--accent);
      }
      .settings-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 24px;
      }
      .setting-card {
        background: var(--panel);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 24px;
      }
      .setting-card h3 {
        font-size: 14px;
        color: var(--text2);
        margin: 0 0 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .setting-card p {
        font-size: 18px;
        font-weight: 600;
        margin: 0;
      }
      .status-ok {
        color: #22c55e;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .info-box {
        background: rgba(59, 130, 246, 0.1);
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 12px;
        padding: 20px;
        display: flex;
        gap: 12px;
        color: #3b82f6;
      }
      .info-box i {
        font-size: 24px;
        flex-shrink: 0;
      }
      .info-box p {
        margin: 0;
        font-size: 14px;
        line-height: 1.5;
      }
      @media (max-width: 1024px) {
        .main {
          margin-left: 0;
          width: 100%;
          padding: 20px;
        }
      }
    `,
  ],
})
export class AdminSettings {}
