import { Component, inject, signal, computed, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { LedgerService, LedgerData } from '../../../ledger/services/ledger.service';
import { ToastService } from '../../../../core/services/toast.service';
import { formatAmount, formatCompact } from '../../../../core/utils/format.utils';
import { CATEGORIES, getCategoryColor, getCategoryLabel } from '../../../../core/constants/categories.constants';

Chart.register(...registerables);

const LEGEND_LABEL_STYLE = { font: { family: 'Inter', size: 12 }, boxWidth: 10, boxHeight: 10, borderRadius: 5, padding: 16 };
const CHART_TICK_FONT = { family: 'Inter', size: 11 };
const CHART_COLORS = {
    credit: { backgroundColor: 'rgba(34,197,94,0.85)', borderColor: '#22C55E', borderWidth: 1.5 },
    debit: { backgroundColor: 'rgba(239,68,68,0.8)', borderColor: '#EF4444', borderWidth: 1.5 },
    linePositive: { borderColor: '#2563EB', backgroundColor: 'rgba(37,99,235,0.08)', pointBackgroundColor: '#2563EB' },
    lineNegative: { borderColor: '#EF4444', backgroundColor: 'rgba(239,68,68,0.08)', pointBackgroundColor: '#EF4444' },
};

export interface MonthStat {
    month: string;
    label: string;
    credit: number;
    debit: number;
    net: number;
}

@Component({
    selector: 'app-statistics',
    standalone: true,
    imports: [],
    templateUrl: './statistics.component.html',
    styleUrl: './statistics.component.scss',
})
export class StatisticsComponent implements OnInit, OnDestroy {
    private ledgerService = inject(LedgerService);
    private toast = inject(ToastService);

    @ViewChild('barChartCanvas') barChartCanvas?: ElementRef<HTMLCanvasElement>;
    @ViewChild('lineChartCanvas') lineChartCanvas?: ElementRef<HTMLCanvasElement>;
    @ViewChild('doughnutChartCanvas') doughnutChartCanvas?: ElementRef<HTMLCanvasElement>;

    isLoading = signal(true);
    ledger = signal<LedgerData | null>(null);

    private chartsCreated = false;
    private barChart: Chart | null = null;
    private lineChart: Chart | null = null;
    private doughnutChart: Chart | null = null;

    // ── Computed stats ──

    monthStats = computed<MonthStat[]>(() => {
        const data = this.ledger();
        if (!data) return [];
        const map = new Map<string, { credit: number; debit: number }>();
        for (const op of data.operations) {
            const d = new Date(op.date);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const cur = map.get(key) ?? { credit: 0, debit: 0 };
            cur.credit += op.credit ?? 0;
            cur.debit += op.debit ?? 0;
            map.set(key, cur);
        }
        return Array.from(map.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .slice(-6)
            .map(([key, v]) => {
                const [year, month] = key.split('-');
                const label = new Date(+year, +month - 1, 1).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
                return { month: key, label, credit: v.credit, debit: v.debit, net: v.credit - v.debit };
            });
    });

    balanceEvolution = computed<{ label: string; balance: number }[]>(() => {
        const data = this.ledger();
        if (!data) return [];
        const initial = (data as LedgerData & { initialBalance?: number }).initialBalance ?? 0;
        let running = initial;
        return this.monthStats().map((s) => {
            running += s.net;
            return { label: s.label, balance: running };
        });
    });

    avgMonthlyCredit = computed(() => {
        const stats = this.monthStats();
        if (!stats.length) return 0;
        return stats.reduce((s, m) => s + m.credit, 0) / stats.length;
    });

    avgMonthlyDebit = computed(() => {
        const stats = this.monthStats();
        if (!stats.length) return 0;
        return stats.reduce((s, m) => s + m.debit, 0) / stats.length;
    });

    savingsRate = computed(() => {
        const c = this.avgMonthlyCredit();
        if (c === 0) return 0;
        return Math.round(((c - this.avgMonthlyDebit()) / c) * 100);
    });

    // ── Lifecycle ──

    ngOnInit() {
        this.ledgerService.getLedger().subscribe({
            next: (d) => {
                this.ledger.set(d);
                this.isLoading.set(false);
                // Attendre qu'Angular rende le @if(ledger()) et les canvas
                this.tryCreateCharts();
            },
            error: () => {
                this.toast.error('Erreur chargement statistiques');
                this.isLoading.set(false);
            },
        });
    }

    private tryCreateCharts(attempt = 0) {
        if (this.chartsCreated) return;
        if (this.barChartCanvas) {
            this.chartsCreated = true;
            this.createCharts();
        } else if (attempt < 20) {
            // Réessaye jusqu'à ce que les canvas soient dans le DOM
            setTimeout(() => this.tryCreateCharts(attempt + 1), 50);
        }
    }

    ngOnDestroy() {
        this.barChart?.destroy();
        this.lineChart?.destroy();
        this.doughnutChart?.destroy();
    }

    // ── Chart creation ──

    private createCharts() {
        this.createBarChart();
        this.createLineChart();
        this.createDoughnutChart();
    }

    private createBarChart() {
        const el = this.barChartCanvas?.nativeElement;
        if (!el) return;
        this.barChart?.destroy();
        const stats = this.monthStats();
        this.barChart = new Chart(el, {
            type: 'bar',
            data: {
                labels: stats.map((s) => s.label),
                datasets: [
                    { label: 'Revenus', data: stats.map((s) => s.credit), ...CHART_COLORS.credit, borderRadius: 6 },
                    { label: 'Dépenses', data: stats.map((s) => s.debit), ...CHART_COLORS.debit, borderRadius: 6 },
                ],
            },
            options: this.buildCartesianOptions(
                'top',
                (ctx) => ` ${ctx.dataset.label}: ${this.formatAmount(ctx.raw as number)} Ar`,
            ),
        });
    }

    private createLineChart() {
        const el = this.lineChartCanvas?.nativeElement;
        if (!el) return;
        this.lineChart?.destroy();
        const evolution = this.balanceEvolution();
        const positive = evolution.length === 0 || evolution[evolution.length - 1].balance >= 0;
        const palette = positive ? CHART_COLORS.linePositive : CHART_COLORS.lineNegative;
        this.lineChart = new Chart(el, {
            type: 'line',
            data: {
                labels: evolution.map((e) => e.label),
                datasets: [
                    {
                        label: 'Solde cumulé',
                        data: evolution.map((e) => e.balance),
                        ...palette,
                        borderWidth: 2.5,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                    },
                ],
            },
            options: this.buildCartesianOptions('top', (ctx) => ` Solde: ${this.formatAmount(ctx.raw as number)} Ar`),
        });
    }

    private createDoughnutChart() {
        const el = this.doughnutChartCanvas?.nativeElement;
        if (!el) return;
        this.doughnutChart?.destroy();
        const d = this.ledger();
        if (!d) return;
        this.doughnutChart = new Chart(el, {
            type: 'doughnut',
            data: {
                labels: ['Revenus', 'Dépenses'],
                datasets: [
                    {
                        data: [d.totalCredit, d.totalDebit],
                        backgroundColor: [CHART_COLORS.credit.backgroundColor, CHART_COLORS.debit.backgroundColor],
                        borderColor: [CHART_COLORS.credit.borderColor, CHART_COLORS.debit.borderColor],
                        borderWidth: 1.5,
                        hoverOffset: 6,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                cutout: '68%',
                plugins: {
                    legend: { position: 'bottom', labels: LEGEND_LABEL_STYLE },
                    tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${this.formatAmount(ctx.raw as number)} Ar` } },
                },
            },
        });
    }

    private buildCartesianOptions(
        legendPos: 'top' | 'bottom',
        tooltipFn: (ctx: { dataset: { label?: string }; label?: string; raw: unknown }) => string,
    ) {
        return {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: legendPos, labels: LEGEND_LABEL_STYLE },
                tooltip: { callbacks: { label: tooltipFn } },
            },
            scales: {
                x: { grid: { display: false }, ticks: { font: CHART_TICK_FONT } },
                y: {
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    ticks: { font: CHART_TICK_FONT, callback: (v: string | number) => this.formatCompact(v as number) },
                },
            },
        };
    }

    // ── Category stats ──

    categoryStats = computed(() => {
        const data = this.ledger();
        if (!data) return [];
        const map = new Map<string, number>();
        for (const op of data.operations) {
            const key = op.category ?? 'autres';
            map.set(key, (map.get(key) ?? 0) + (op.debit ?? 0));
        }
        const total = Array.from(map.values()).reduce((s, v) => s + v, 0) || 1;
        return Array.from(map.entries())
            .sort(([, a], [, b]) => b - a)
            .map(([key, amount]) => ({
                key,
                label: getCategoryLabel(key),
                color: getCategoryColor(key),
                amount,
                pct: Math.round((amount / total) * 100),
            }));
    });

    // ── Helpers ──

    readonly Math = Math;
    formatAmount = formatAmount;
    formatCompact = formatCompact;
    getCategoryColor = getCategoryColor;
}
