import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class App implements OnInit {
  private authService = inject(AuthService);

  ngOnInit(): void {
    // ✅ Charge le profil si un token existe déjà
    this.authService.init();
  }
}
