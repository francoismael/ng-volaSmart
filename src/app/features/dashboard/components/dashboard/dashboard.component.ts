import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService, DashboardData } from '../../services/dashboard.service';
import { ToastService } from '../../../../core/services/toast.service';
import { formatAmount } from '../../../../core/utils/format.utils';

type Period = 'today' | 'week' | 'month' | 'year';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private toast = inject(ToastService);

  data = signal<DashboardData | null>(null);
  isLoading = signal(true);
  period = signal<Period>('month');

  periods: { key: Period; label: string }[] = [
    { key: 'today', label: "Aujourd'hui" },
    { key: 'week', label: 'Semaine' },
    { key: 'month', label: 'Mois' },
    { key: 'year', label: 'Année' },
  ];

  periodDebit = computed(() => {
    const d = this.data();
    if (!d) return 0;
    const p = this.period();
    if (p === 'today') return d.todayDebit;
    if (p === 'week') return d.weekDebit;
    if (p === 'month') return d.monthDebit;
    return d.yearDebit;
  });

  periodCredit = computed(() => {
    const d = this.data();
    if (!d) return 0;
    const p = this.period();
    if (p === 'today') return d.todayCredit;
    if (p === 'week') return d.weekCredit;
    if (p === 'month') return d.monthCredit;
    return d.yearCredit;
  });

  ngOnInit() {
    this.dashboardService.getDashboard().subscribe({
      next: (d) => {
        this.data.set(d);
        this.isLoading.set(false);
      },
      error: () => {
        this.toast.error('Erreur chargement dashboard');
        this.isLoading.set(false);
      },
    });
  }

  setPeriod(p: Period) {
    this.period.set(p);
  }

  readonly Math = Math;
  formatAmount = formatAmount;
}
