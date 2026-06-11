import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  error = '';
  loading = false;

  onLogin(): void {
    this.loading = true;
    this.error = '';

    this.authService.login(this.username, this.password).subscribe({
      next: () => {

        const homeRoute = this.authService.getHomeRoute();
        this.router.navigate([homeRoute]);
      },
      error: (err) => {
        this.error = 'Identifiants incorrects. Veuillez réessayer.';
        this.loading = false;
        console.error(err);
      },
    });
  }
}
