import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  username = '';
  email = '';
  password = '';
  showPassword = signal(false);
  isLoading = signal(false);
  error = signal('');
  success = signal('');

  togglePassword() {
    this.showPassword.update((v) => !v);
  }

  onSubmit() {
    if (!this.username || !this.email || !this.password) {
      this.error.set('Veuillez remplir tous les champs');
      return;
    }
    if (this.password.length < 12) {
      this.error.set('Le mot de passe doit contenir au moins 12 caractères');
      return;
    }
    this.isLoading.set(true);
    this.error.set('');
    this.auth.register({ username: this.username, email: this.email, password: this.password }).subscribe({
      next: () => {
        this.success.set('Compte créé avec succès ! Redirection...');
        setTimeout(() => this.router.navigate(['/auth/login']), 1500);
      },
      error: (err) => {
        if (err.status === 409) this.error.set('Cet email est déjà utilisé');
        else this.error.set('Erreur lors de la création du compte');
        this.isLoading.set(false);
      },
    });
  }
}
