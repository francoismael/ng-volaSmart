import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RecurringService } from '../../services/recurring.service';
import { formatAmount } from '../../../../core/utils/format.utils';
import {
  RecurringOperation,
  RecurringFrequency,
  RecurringType,
  FREQUENCY_SHORT,
  DAY_OF_WEEK_LABELS,
  DAY_OF_WEEK_FULL,
} from '../../models/recurring.model';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-recurring-list',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './recurring-list.component.html',
})
export class RecurringListComponent implements OnInit {
  private recurringService = inject(RecurringService);
  private toast = inject(ToastService);

  items = signal<RecurringOperation[]>([]);
  isLoading = signal(true);
  showForm = signal(false);
  editingItem = signal<RecurringOperation | null>(null);
  deleteTarget = signal<RecurringOperation | null>(null);
  formLoading = signal(false);

  // Form fields
  formLabel = '';
  formAmount: number | null = null;
  formType: RecurringType = 'debit';
  formFrequency: RecurringFrequency = 'monthly';
  formDayOfMonth = 1;
  formDaysOfWeek: number[] = [1]; // Lundi par défaut
  formNotes = '';
  formIsActive = true;

  filterType = signal<'all' | 'debit' | 'credit'>('all');

  filteredItems = computed(() => {
    const f = this.filterType();
    if (f === 'all') return this.items();
    return this.items().filter((i) => i.type === f);
  });

  totalMonthlyDebit = computed(() =>
    this.items()
      .filter((i) => i.isActive && i.type === 'debit' && i.frequency === 'monthly')
      .reduce((s, i) => s + i.amount, 0)
  );

  totalMonthlyCredit = computed(() =>
    this.items()
      .filter((i) => i.isActive && i.type === 'credit' && i.frequency === 'monthly')
      .reduce((s, i) => s + i.amount, 0)
  );

  readonly FREQUENCY_SHORT = FREQUENCY_SHORT;
  readonly DAY_OF_WEEK_LABELS = DAY_OF_WEEK_LABELS;
  readonly DAY_OF_WEEK_FULL = DAY_OF_WEEK_FULL;

  readonly allDays = [0, 1, 2, 3, 4, 5, 6];

  frequencies: { key: RecurringFrequency; label: string; desc: string }[] = [
    { key: 'daily',   label: 'Quotidien',    desc: 'Chaque jour' },
    { key: 'weekly',  label: 'Hebdomadaire', desc: 'Les jours sélectionnés chaque semaine' },
    { key: 'monthly', label: 'Mensuel',      desc: 'Le jour du mois choisi' },
    { key: 'yearly',  label: 'Annuel',       desc: 'Une fois par an' },
  ];

  ngOnInit() { this.load(); }

  load() {
    this.isLoading.set(true);
    this.recurringService.getAll().subscribe({
      next: (data) => { this.items.set(data); this.isLoading.set(false); },
      error: () => { this.toast.error('Erreur chargement'); this.isLoading.set(false); },
    });
  }

  openCreate() {
    this.editingItem.set(null);
    this.formLabel = '';
    this.formAmount = null;
    this.formType = 'debit';
    this.formFrequency = 'monthly';
    this.formDayOfMonth = 1;
    this.formDaysOfWeek = [1];
    this.formNotes = '';
    this.formIsActive = true;
    this.showForm.set(true);
  }

  openEdit(item: RecurringOperation) {
    this.editingItem.set(item);
    this.formLabel = item.label;
    this.formAmount = item.amount;
    this.formType = item.type;
    this.formFrequency = item.frequency;
    this.formDayOfMonth = item.dayOfMonth ?? 1;
    this.formDaysOfWeek = item.daysOfWeek ? [...item.daysOfWeek] : [1];
    this.formNotes = item.notes ?? '';
    this.formIsActive = item.isActive;
    this.showForm.set(true);
  }

  closeForm() { this.showForm.set(false); this.editingItem.set(null); }

  /** Toggle un jour dans la sélection multiple */
  toggleDay(day: number) {
    const idx = this.formDaysOfWeek.indexOf(day);
    if (idx === -1) {
      this.formDaysOfWeek = [...this.formDaysOfWeek, day].sort((a, b) => a - b);
    } else {
      if (this.formDaysOfWeek.length === 1) return; // au moins un jour requis
      this.formDaysOfWeek = this.formDaysOfWeek.filter(d => d !== day);
    }
  }

  isDaySelected(day: number): boolean {
    return this.formDaysOfWeek.includes(day);
  }

  /** Raccourcis pratiques */
  selectWeekdays() { this.formDaysOfWeek = [1, 2, 3, 4, 5]; }
  selectWeekend()  { this.formDaysOfWeek = [0, 6]; }
  selectAll()      { this.formDaysOfWeek = [0, 1, 2, 3, 4, 5, 6]; }

  saveForm() {
    if (!this.formLabel || !this.formAmount || this.formAmount <= 0) {
      this.toast.error('Libellé et montant requis');
      return;
    }
    if (this.formFrequency === 'weekly' && this.formDaysOfWeek.length === 0) {
      this.toast.error('Sélectionnez au moins un jour');
      return;
    }
    this.formLoading.set(true);
    const payload: Partial<RecurringOperation> = {
      label: this.formLabel,
      amount: this.formAmount,
      type: this.formType,
      frequency: this.formFrequency,
      dayOfMonth: this.formFrequency === 'monthly' ? this.formDayOfMonth : undefined,
      daysOfWeek: this.formFrequency === 'weekly' ? this.formDaysOfWeek : undefined,
      notes: this.formNotes || undefined,
      isActive: this.formIsActive,
    };
    const editing = this.editingItem();
    const obs = editing
      ? this.recurringService.update(editing.id, payload)
      : this.recurringService.create(payload);

    obs.subscribe({
      next: () => {
        this.toast.success(editing ? 'Modifiée' : 'Créée — opération du jour enregistrée');
        this.closeForm();
        this.load();
        this.formLoading.set(false);
      },
      error: () => { this.toast.error('Erreur sauvegarde'); this.formLoading.set(false); },
    });
  }

  toggleActive(item: RecurringOperation) {
    this.recurringService.toggle(item.id, !item.isActive).subscribe({
      next: () => { this.toast.success(item.isActive ? 'Désactivée' : 'Activée'); this.load(); },
      error: () => this.toast.error('Erreur'),
    });
  }

  confirmDelete(item: RecurringOperation) { this.deleteTarget.set(item); }
  cancelDelete() { this.deleteTarget.set(null); }

  doDelete() {
    const item = this.deleteTarget();
    if (!item) return;
    this.recurringService.delete(item.id).subscribe({
      next: () => { this.toast.success('Supprimée'); this.deleteTarget.set(null); this.load(); },
      error: () => this.toast.error('Erreur suppression'),
    });
  }

  formatAmount = formatAmount;

  getFreqLabel(item: RecurringOperation): string {
    if (item.frequency === 'weekly' && item.daysOfWeek?.length) {
      const dayNames = item.daysOfWeek
        .sort((a, b) => a - b)
        .map(d => DAY_OF_WEEK_LABELS[d])
        .join(', ');
      return `Hebdo · ${dayNames}`;
    }
    if (item.frequency === 'monthly' && item.dayOfMonth) {
      return `Mensuel · j.${item.dayOfMonth}`;
    }
    return FREQUENCY_SHORT[item.frequency];
  }
}
