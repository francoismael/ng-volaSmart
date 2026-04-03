import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
    },
    {
        path: 'app',
        loadComponent: () => import('./shell/shell.component').then((m) => m.ShellComponent),
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./features/dashboard/components/dashboard/dashboard.component').then((m) => m.DashboardComponent),
            },
            {
                path: 'accounts',
                loadComponent: () =>
                    import('./features/accounts/components/accounts-list/accounts-list.component').then(
                        (m) => m.AccountsListComponent,
                    ),
            },
            {
                path: 'operations',
                loadComponent: () =>
                    import('./features/operations/components/operations-list/operations-list.component').then(
                        (m) => m.OperationsListComponent,
                    ),
            },
            {
                path: 'ledger',
                loadComponent: () =>
                    import('./features/ledger/components/ledger/ledger.component').then((m) => m.LedgerComponent),
            },
            {
                path: 'profile',
                loadComponent: () =>
                    import('./features/profile/components/profile/profile.component').then((m) => m.ProfileComponent),
            },
            {
                path: 'statistics',
                loadComponent: () =>
                    import('./features/statistics/components/statistics/statistics.component').then((m) => m.StatisticsComponent),
            },
            {
                path: 'recurring',
                loadComponent: () =>
                    import('./features/recurring/components/recurring-list/recurring-list.component').then(
                        (m) => m.RecurringListComponent,
                    ),
            },
            {
                path: 'budget',
                loadComponent: () =>
                    import('./features/budget/components/budget/budget.component').then((m) => m.BudgetComponent),
            },
        ],
    },
    { path: '**', redirectTo: 'auth/login' },
];
