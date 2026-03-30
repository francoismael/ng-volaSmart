import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { ToastService } from '../core/services/toast.service';
import { ToastComponent } from '../core/components/toast/toast.component';
import { NotificationService } from '../core/services/notification.service';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);
  notifService = inject(NotificationService);

  sidebarOpen = signal(false);
  showLogoutConfirm = signal(false);
  showNotifPanel = signal(false);
  username = signal('');
  pageTitle = signal('Dashboard');

  navItems: NavItem[] = [
    { path: '/app/dashboard', label: 'Dashboard', icon: '' },
    { path: '/app/operations', label: 'Opérations', icon: '' },
    { path: '/app/ledger', label: 'Livre Comptable', icon: '' },
    { path: '/app/statistics', label: 'Statistiques', icon: '' },
  ];

  constructor() {
    this.auth.getProfile().subscribe({
      next: (p) => this.username.set(p.username),
      error: () => {},
    });
    this.notifService.load();
  }

  toggleNotifPanel() {
    this.showNotifPanel.update((v) => !v);
  }

  closeNotifPanel() {
    this.showNotifPanel.set(false);
  }

  daysLabel(d: number): string {
    if (d < 0)  return 'En retard';
    if (d === 0) return "Aujourd'hui";
    if (d === 1) return 'Demain';
    return `Dans ${d} jours`;
  }

  toggleSidebar() {
    this.sidebarOpen.update((v) => !v);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }

  setTitle(label: string) {
    this.pageTitle.set(label);
    this.closeSidebar();
  }

  confirmLogout() {
    this.showLogoutConfirm.set(true);
  }

  cancelLogout() {
    this.showLogoutConfirm.set(false);
  }

  doLogout() {
    this.auth.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
        this.toast.success('Déconnecté avec succès');
      },
      error: () => {
        localStorage.removeItem('vs_token');
        this.router.navigate(['/auth/login']);
      },
    });
    this.showLogoutConfirm.set(false);
  }

}
