import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { OperationsService, PaginatedOperations } from '../../services/operations.service';
import { Operation } from '../../models/operation.model';
import { ToastService } from '../../../../core/services/toast.service';
import { formatAmount } from '../../../../core/utils/format.utils';
import { CATEGORIES, getCategoryColor, getCategoryLabel } from '../../../../core/constants/categories.constants';

type PeriodTab = 'today' | 'week' | 'month' | 'year' | 'all';

@Component({
    selector: 'app-operations-list',
    standalone: true,
    imports: [FormsModule, DatePipe],
    templateUrl: './operations-list.component.html',
})
export class OperationsListComponent implements OnInit {
    private opService = inject(OperationsService);
    private toast = inject(ToastService);

    operations = signal<Operation[]>([]);
    isLoading = signal(true);
    showForm = signal(false);
    editingOp = signal<Operation | null>(null);
    deleteTarget = signal<Operation | null>(null);
    viewingOp = signal<Operation | null>(null);
    activePeriod = signal<PeriodTab>('all');

    // Pagination
    currentPage = signal(1);
    totalPages = signal(1);
    totalItems = signal(0);
    readonly pageLimit = 50;

    // Totals (from backend, covers full filtered range)
    totalDebit = signal(0);
    totalCredit = signal(0);

    // Filters
    filterStartDate = '';
    filterEndDate = '';
    showCustomFilter = signal(false);

    // Form fields
    formDate = '';
    formLabel = '';
    formDebit: number | null = null;
    formCredit: number | null = null;
    formCategory = 'autres';
    formNotes = '';
    formLoading = signal(false);

    readonly categories = CATEGORIES;
    getCategoryColor = getCategoryColor;
    getCategoryLabel = getCategoryLabel;

    periods: { key: PeriodTab; label: string }[] = [
        { key: 'today', label: 'Auj.' },
        { key: 'week', label: 'Semaine' },
        { key: 'month', label: 'Mois' },
        { key: 'year', label: 'Année' },
        { key: 'all', label: 'Tout' },
    ];

    ngOnInit() {
        this.load();
    }

    setPeriod(p: PeriodTab) {
        this.activePeriod.set(p);
        if (p === 'all') {
            this.filterStartDate = '';
            this.filterEndDate = '';
        } else {
            const { start, end } = this.getPeriodDates(p);
            this.filterStartDate = start;
            this.filterEndDate = end;
        }
        this.load(1);
    }

    private getPeriodDates(p: 'today' | 'week' | 'month' | 'year'): { start: string; end: string } {
        const now = new Date();
        const fmt = (d: Date) => d.toISOString().split('T')[0];
        if (p === 'today') {
            const d = fmt(now);
            return { start: d, end: d };
        }
        if (p === 'week') {
            const start = new Date(now);
            const day = now.getDay();
            start.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
            return { start: fmt(start), end: fmt(now) };
        }
        if (p === 'month') {
            const start = new Date(now.getFullYear(), now.getMonth(), 1);
            return { start: fmt(start), end: fmt(now) };
        }
        // year
        const start = new Date(now.getFullYear(), 0, 1);
        return { start: fmt(start), end: fmt(now) };
    }

    load(page = 1) {
        this.isLoading.set(true);
        this.opService
            .getAllPaginated({
                startDate: this.filterStartDate || undefined,
                endDate: this.filterEndDate || undefined,
                page,
                limit: this.pageLimit,
            })
            .subscribe({
                next: (res: PaginatedOperations) => {
                    this.operations.set(res.data);
                    this.currentPage.set(res.page);
                    this.totalPages.set(res.totalPages);
                    this.totalItems.set(res.total);
                    this.totalDebit.set(res.totalDebit);
                    this.totalCredit.set(res.totalCredit);
                    this.isLoading.set(false);
                },
                error: () => {
                    this.toast.error('Erreur chargement opérations');
                    this.isLoading.set(false);
                },
            });
    }

    goToPage(page: number) {
        if (page < 1 || page > this.totalPages()) return;
        this.load(page);
    }

    applyCustomFilter() {
        this.activePeriod.set('all');
        this.load(1);
    }

    clearFilters() {
        this.filterStartDate = '';
        this.filterEndDate = '';
        this.activePeriod.set('all');
        this.showCustomFilter.set(false);
        this.load(1);
    }

    // ── CRUD ──

    openCreate() {
        this.editingOp.set(null);
        this.formDate = new Date().toISOString().split('T')[0];
        this.formLabel = '';
        this.formDebit = null;
        this.formCredit = null;
        this.formCategory = 'autres';
        this.formNotes = '';
        this.showForm.set(true);
    }

    openEdit(op: Operation) {
        this.viewingOp.set(null);
        this.editingOp.set(op);
        this.formDate = op.date ? op.date.split('T')[0] : '';
        this.formLabel = op.label;
        this.formDebit = op.debit || null;
        this.formCredit = op.credit || null;
        this.formCategory = op.category ?? 'autres';
        this.formNotes = op.notes || '';
        this.showForm.set(true);
    }

    closeForm() {
        this.showForm.set(false);
        this.editingOp.set(null);
    }

    saveForm() {
        if (!this.formLabel || !this.formDate) {
            this.toast.error('Date et libellé sont requis');
            return;
        }
        this.formLoading.set(true);
        const payload = {
            date: this.formDate,
            label: this.formLabel,
            debit: this.formDebit ?? 0,
            credit: this.formCredit ?? 0,
            category: this.formCategory,
            notes: this.formNotes,
        };
        const editing = this.editingOp();
        const obs = editing ? this.opService.update(editing.id, payload) : this.opService.create(payload);
        obs.subscribe({
            next: () => {
                this.toast.success(editing ? 'Opération modifiée' : 'Opération créée');
                this.closeForm();
                this.load();
                this.formLoading.set(false);
            },
            error: () => {
                this.toast.error('Erreur sauvegarde');
                this.formLoading.set(false);
            },
        });
    }

    // ── Detail ──

    viewDetail(op: Operation) {
        this.viewingOp.set(op);
    }

    closeDetail() {
        this.viewingOp.set(null);
    }

    // ── Delete ──

    confirmDelete(op: Operation) {
        this.deleteTarget.set(op);
    }

    cancelDelete() {
        this.deleteTarget.set(null);
    }

    doDelete() {
        const op = this.deleteTarget();
        if (!op) return;
        this.opService.delete(op.id).subscribe({
            next: () => {
                this.toast.success('Opération supprimée');
                this.deleteTarget.set(null);
                this.load();
            },
            error: () => this.toast.error('Erreur suppression'),
        });
    }

    readonly Math = Math;
    formatAmount = formatAmount;

    getPeriodLabel(): string {
        const p = this.activePeriod();
        if (p === 'all') return 'Toutes les opérations';
        const labels: Record<string, string> = {
            today: "Aujourd'hui",
            week: 'Cette semaine',
            month: 'Ce mois',
            year: 'Cette année',
        };
        return labels[p] ?? '';
    }
}
