import { Component, inject, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LedgerService, LedgerData } from '../../services/ledger.service';
import { ToastService } from '../../../../core/services/toast.service';
import { formatAmount } from '../../../../core/utils/format.utils';

@Component({
    selector: 'app-ledger',
    standalone: true,
    imports: [DatePipe],
    templateUrl: './ledger.component.html',
})
export class LedgerComponent implements OnInit {
    private ledgerService = inject(LedgerService);
    private toast = inject(ToastService);

    data = signal<LedgerData | null>(null);
    isLoading = signal(true);
    showExportConfirm = signal(false);
    pendingExportUrl = signal('');

    readonly exportLinks = [
        { label: 'Export CSV', url: 'http://localhost:3000/export/csv' },
        { label: 'Export PDF', url: 'http://localhost:3000/export/pdf' },
    ];

    ngOnInit() {
        this.ledgerService.getLedger().subscribe({
            next: (d) => {
                this.data.set(d);
                this.isLoading.set(false);
            },
            error: () => {
                this.toast.error('Erreur chargement livre');
                this.isLoading.set(false);
            },
        });
    }

    confirmExport(url: string) {
        this.pendingExportUrl.set(url);
        this.showExportConfirm.set(true);
    }

    cancelExport() {
        this.showExportConfirm.set(false);
        this.pendingExportUrl.set('');
    }

    doExport() {
        const url = this.pendingExportUrl();
        this.showExportConfirm.set(false);
        this.pendingExportUrl.set('');
        const token = localStorage.getItem('vs_token');
        fetch(url, { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.blob())
            .then((blob) => {
                const u = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = u;
                a.download = url.includes('csv') ? 'volasmart.csv' : 'volasmart.pdf';
                a.click();
                URL.revokeObjectURL(u);
                this.toast.success('Export téléchargé avec succès');
            })
            .catch(() => this.toast.error("Erreur lors de l'export"));
    }

    readonly Math = Math;
    formatAmount = formatAmount;

    runningBalance(index: number): number {
        const ops = this.data()?.operations ?? [];
        let balance = 0;
        for (let i = 0; i <= index; i++) {
            balance += (ops[i].credit ?? 0) - (ops[i].debit ?? 0);
        }
        return balance;
    }
}
