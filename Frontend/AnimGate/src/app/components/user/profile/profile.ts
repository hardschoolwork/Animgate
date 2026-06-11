import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { AnimeService } from '../../../services/anime.service';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Topbar } from '../../shared/topbar/topbar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Topbar],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private authService = inject(AuthService);
  private animeService = inject(AnimeService);

  user = this.authService.user;

  // Onglet actif : 'info' ou 'password'
  activeTab = signal<'info' | 'password'>('info');

  // Champs Profil
  profileUsername = '';
  profileEmail = '';
  profileLoading = signal(false);
  profileSuccess = signal('');
  profileError = signal('');

  // Champs Mot de passe
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  passwordLoading = signal(false);
  passwordSuccess = signal('');
  passwordError = signal('');

  ngOnInit(): void {
    const currentUser = this.user();
    if (currentUser) {
      this.profileUsername = currentUser.username;
      this.profileEmail = currentUser.email || '';
    }
  }

  saveProfile(): void {
    if (!this.profileUsername.trim()) {
      this.profileError.set("Le nom d'utilisateur est obligatoire");
      return;
    }

    this.profileLoading.set(true);
    this.profileError.set('');
    this.profileSuccess.set('');

    this.animeService
      .updateProfile({
        username: this.profileUsername,
        email: this.profileEmail,
      })
      .subscribe({
        next: () => {
          this.profileSuccess.set('Profil mis à jour avec succès !');
          this.profileLoading.set(false);
          // Optionnel : rafraîchir le token ou l'état de l'utilisateur si nécessaire
        },
        error: (err) => {
          this.profileError.set(
            err.error?.username?.[0] || err.error?.email?.[0] || 'Erreur lors de la mise à jour',
          );
          this.profileLoading.set(false);
        },
      });
  }

  savePassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError.set('Les mots de passe ne correspondent pas');
      return;
    }
    if (this.newPassword.length < 8) {
      this.passwordError.set('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    this.passwordLoading.set(true);
    this.passwordError.set('');
    this.passwordSuccess.set('');

    this.animeService
      .changePassword({
        old_password: this.oldPassword,
        new_password: this.newPassword,
        confirm_password: this.confirmPassword,
      })
      .subscribe({
        next: () => {
          this.passwordSuccess.set('Mot de passe modifié avec succès !');
          this.oldPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
          this.passwordLoading.set(false);
        },
        error: (err) => {
          const errorMsg =
            err.error?.non_field_errors?.[0] ||
            err.error?.old_password?.[0] ||
            'Erreur lors du changement';
          this.passwordError.set(errorMsg);
          this.passwordLoading.set(false);
        },
      });
  }
}
