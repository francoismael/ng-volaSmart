import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BudgetService, BudgetSummaryItem } from '../../services/budget.service';
import { ToastService } from '../../../../core/services/toast.service';
import { CATEGORIES, getCategoryLabel, getCategoryColor } from '../../../../core/constants/categories.constants';
import { formatAmount } from '../../../../core/utils/format.utils';

@Component({
    selector: 'app-budget',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './budget.component.html',
    styleUrl: './budget.component.scss',
})
export class BudgetComponent implements OnInit {
    private budgetService = inject(BudgetService);
    private toast = inject(ToastService);

    readonly categories = CATEGORIES;
    getCategoryLabel = getCategoryLabel;
    getCategoryColor = getCategoryColor;
    formatAmount = formatAmount;
    readonly Math = Math;

    isLoading = signal(true);
    summary = signal<BudgetSummaryItem[]>([]);

    // Month picker (default = current month)
    selectedMonth = signal<string>(this.currentMonthStr());

    showForm = signal(false);
    formCategory = signal('alimentation');
    formAmount = signal<number | null>(null);
    formLoading = signal(false);

    // Categories that don't have a budget yet for selected month
    unbudgetedCategories = computed(() => {
        const budgeted = new Set(this.summary().map((s) => s.category));
        return this.categories.filter((c) => !budgeted.has(c.key));
    });

    // Overall monthly totals
    totalBudgeted = computed(() => this.summary().reduce((s, i) => s + i.budgeted, 0));
    totalSpent = computed(() => this.summary().reduce((s, i) => s + i.spent, 0));

    ngOnInit() {
        this.loadSummary();
    }

    private currentMonthStr(): string {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }

    monthLabel(): string {
        const [year, m] = this.selectedMonth().split('-');
        return new Date(+year, +m - 1, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    }

    changeMonth(offset: number) {
        const [year, m] = this.selectedMonth().split('-').map(Number);
        const d = new Date(year, m - 1 + offset, 1);
        this.selectedMonth.set(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
        this.loadSummary();
    }

    private loadSummary() {
        this.isLoading.set(true);
        this.budgetService.getSummary(this.selectedMonth()).subscribe({
            next: (data) => {
                this.summary.set(data);
                this.isLoading.set(false);
            },
            error: () => {
                this.toast.error('Erreur chargement budget');
                this.isLoading.set(false);
            },
        });
    }

    openForm() {
        const first = this.unbudgetedCategories()[0];
        this.formCategory.set(first?.key ?? 'autres');
        this.formAmount.set(null);
        this.showForm.set(true);
    }

    openEdit(item: BudgetSummaryItem) {
        this.formCategory.set(item.category);
        this.formAmount.set(item.budgeted);
        this.showForm.set(true);
    }

    closeForm() {
        this.showForm.set(false);
    }

    saveForm() {
        const amount = this.formAmount();
        if (!amount || amount <= 0) {
            this.toast.error('Montant requis');
            return;
        }
        this.formLoading.set(true);
        this.budgetService
            .upsert({
                month: this.selectedMonth(),
                category: this.formCategory(),
                amount,
            })
            .subscribe({
                next: () => {
                    this.toast.success('Budget enregistré');
                    this.closeForm();
                    this.loadSummary();
                    this.formLoading.set(false);
                },
                error: () => {
                    this.toast.error('Erreur sauvegarde');
                    this.formLoading.set(false);
                },
            });
    }

    deleteLine(item: BudgetSummaryItem) {
        this.budgetService.delete(this.selectedMonth(), item.category).subscribe({
            next: () => {
                this.toast.success('Budget supprimé');
                this.loadSummary();
            },
            error: () => this.toast.error('Erreur suppression'),
        });
    }

    statusClass(pct: number): string {
        if (pct >= 100) return 'vs-budget-over';
        if (pct >= 80) return 'vs-budget-warn';
        return 'vs-budget-ok';
    }

    barColor(pct: number): string {
        if (pct >= 100) return 'var(--danger)';
        if (pct >= 80) return 'var(--warning, #F59E0B)';
        return 'var(--success)';
    }
}
