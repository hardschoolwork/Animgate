import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSidebar } from '../shared/admin-sidebar/admin-sidebar';
import { Topbar } from '../shared/topbar/topbar';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, AdminSidebar, Topbar],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css',
})
export class AdminUsers implements OnInit {
  private adminService = inject(AdminService);

  users = signal<any[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.adminService.getUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  toggleAdmin(user: any): void {
    const newState = !user.is_staff;
    this.adminService.updateUserStatus(user.id, { is_staff: newState }).subscribe({
      next: () => {
        this.users.update((list) =>
          list.map((u) => (u.id === user.id ? { ...u, is_staff: newState } : u)),
        );
      },
      error: (err) => alert(err.error?.error || 'Erreur de modification'),
    });
  }

  toggleActive(user: any): void {
    const newState = !user.is_active;
    const actionText = newState ? 'réactiver' : 'désactiver';

    if (confirm(`Voulez-vous vraiment ${actionText} l'utilisateur "${user.username}" ?`)) {
      this.adminService.updateUserStatus(user.id, { is_active: newState }).subscribe({
        next: () => {
          this.users.update((list) =>
            list.map((u) => (u.id === user.id ? { ...u, is_active: newState } : u)),
          );
        },
        error: (err) => alert(err.error?.error || 'Erreur de modification'),
      });
    }
  }
}
