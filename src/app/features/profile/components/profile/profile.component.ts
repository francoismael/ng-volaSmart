import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../../core/services/toast.service';
import { environment } from '../../../../../environments/environment';

interface ProfileData {
    username: string;
    email: string;
    initialBalance?: number;
}

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
    private http = inject(HttpClient);
    private toast = inject(ToastService);

    username = signal('');
    email = signal('');
    usernameInput = '';
    emailInput = '';
    initialBalanceInput: number = 0;
    profileLoading = signal(false);

    currentPassword = '';
    newPassword = '';
    confirmPassword = '';
    showCurrentPw = signal(false);
    showNewPw = signal(false);
    passwordLoading = signal(false);

    ngOnInit() {
        this.http.get<ProfileData>(`${environment.apiUrl}/auth/profile`).subscribe({
            next: (p) => {
                this.username.set(p.username);
                this.email.set(p.email);
                this.usernameInput = p.username;
                this.emailInput = p.email;
                this.initialBalanceInput = p.initialBalance ?? 0;
            },
            error: () => this.toast.error('Erreur chargement du profil'),
        });
    }

    saveProfile() {
        this.profileLoading.set(true);
        this.http
            .patch<ProfileData>(`${environment.apiUrl}/auth/profile`, {
                username: this.usernameInput,
                email: this.emailInput,
                initialBalance: this.initialBalanceInput,
            })
            .subscribe({
                next: (p: ProfileData) => {
                    this.username.set(p.username);
                    this.email.set(p.email);
                    this.initialBalanceInput = p.initialBalance ?? 0;
                    this.toast.success('Profil mis à jour');
                    this.profileLoading.set(false);
                },
                error: (e) => {
                    if (e.status === 409) this.toast.error('Email déjà utilisé');
                    else this.toast.error('Erreur mise à jour');
                    this.profileLoading.set(false);
                },
            });
    }

    changePassword() {
        if (!this.currentPassword || !this.newPassword) {
            this.toast.error('Remplissez tous les champs');
            return;
        }
        if (this.newPassword !== this.confirmPassword) {
            this.toast.error('Les mots de passe ne correspondent pas');
            return;
        }
        if (this.newPassword.length < 12) {
            this.toast.error('Minimum 12 caractères');
            return;
        }
        this.passwordLoading.set(true);
        this.http
            .patch(`${environment.apiUrl}/auth/profile/password`, {
                currentPassword: this.currentPassword,
                newPassword: this.newPassword,
            })
            .subscribe({
                next: () => {
                    this.toast.success('Mot de passe modifié');
                    this.currentPassword = '';
                    this.newPassword = '';
                    this.confirmPassword = '';
                    this.passwordLoading.set(false);
                },
                error: (e) => {
                    if (e.status === 400) this.toast.error('Mot de passe actuel incorrect');
                    else this.toast.error('Erreur modification');
                    this.passwordLoading.set(false);
                },
            });
    }
}
