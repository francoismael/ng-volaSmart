import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountsService } from '../../services/accounts.service';
import { Account, AccountType, ACCOUNT_TYPE_LABELS } from '../../models/account.model';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-accounts-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './accounts-list.component.html',
})
export class AccountsListComponent implements OnInit {
  private accountsService = inject(AccountsService);
  private toast = inject(ToastService);

  accounts = signal<Account[]>([]);
  isLoading = signal(true);
  showForm = signal(false);
  editingAccount = signal<Account | null>(null);
  deleteTarget = signal<Account | null>(null);

  formName = '';
  formType: AccountType = 'caisse';
  formDescription = '';
  formLoading = signal(false);

  accountTypes: AccountType[] = ['caisse', 'banque', 'nourriture', 'salaire', 'transport', 'investissement', 'autre'];
  typeLabels = ACCOUNT_TYPE_LABELS;

  ngOnInit() {
    this.load();
  }

  load() {
    this.isLoading.set(true);
    this.accountsService.getAll().subscribe({
      next: (a) => { this.accounts.set(a); this.isLoading.set(false); },
      error: () => { this.toast.error('Erreur chargement comptes'); this.isLoading.set(false); },
    });
  }

  openCreate() {
    this.editingAccount.set(null);
    this.formName = '';
    this.formType = 'caisse';
    this.formDescription = '';
    this.showForm.set(true);
  }

  openEdit(account: Account) {
    this.editingAccount.set(account);
    this.formName = account.name;
    this.formType = account.type;
    this.formDescription = account.description || '';
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingAccount.set(null);
  }

  saveForm() {
    if (!this.formName) { this.toast.error('Le nom est requis'); return; }
    this.formLoading.set(true);
    const payload = { name: this.formName, type: this.formType, description: this.formDescription };
    const editing = this.editingAccount();
    const obs = editing
      ? this.accountsService.update(editing.id, payload)
      : this.accountsService.create(payload);
    obs.subscribe({
      next: () => {
        this.toast.success(editing ? 'Compte modifié' : 'Compte créé');
        this.closeForm();
        this.load();
        this.formLoading.set(false);
      },
      error: () => { this.toast.error('Erreur sauvegarde'); this.formLoading.set(false); },
    });
  }

  confirmDelete(account: Account) {
    this.deleteTarget.set(account);
  }

  cancelDelete() {
    this.deleteTarget.set(null);
  }

  doDelete() {
    const acc = this.deleteTarget();
    if (!acc) return;
    this.accountsService.delete(acc.id).subscribe({
      next: () => { this.toast.success('Compte supprimé'); this.deleteTarget.set(null); this.load(); },
      error: () => this.toast.error('Erreur suppression'),
    });
  }

  typeClass(type: AccountType): string {
    return `vs-acct-${type}`;
  }
}
