import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  showPassword = signal(false);
  isLoading = signal(false);
  error = signal('');

  togglePassword() {
    this.showPassword.update((v) => !v);
  }

  onSubmit() {
    if (!this.username || !this.password) {
      this.error.set('Veuillez remplir tous les champs');
      return;
    }
    this.isLoading.set(true);
    this.error.set('');
    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: () => this.router.navigate(['/app/dashboard']),
      error: () => {
        this.error.set('Identifiants invalides');
        this.isLoading.set(false);
      },
    });
  }
}
