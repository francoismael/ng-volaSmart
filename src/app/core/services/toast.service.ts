import { Injectable, signal } from '@angular/core';

/** Représentation d'une notification toast affichée à l'utilisateur. */
export interface Toast {
    /** Identifiant unique du toast */
    id: number;
    /** Message affiché */
    message: string;
    /** Type de notification (succès ou erreur) */
    type: 'success' | 'error';
}

/** Service de gestion des notifications toast (succès/erreur). */
@Injectable({ providedIn: 'root' })
export class ToastService {
    readonly toasts = signal<Toast[]>([]);
    private nextId = 0;

    /**
     * Affiche un toast de succès.
     * @param {string} message - Message à afficher
     * @param {number} duration - Durée d'affichage en ms (défaut 3500)
     */
    success(message: string, duration = 3500): void {
        this._add(message, 'success', duration);
    }

    /**
     * Affiche un toast d'erreur.
     * @param {string} message - Message à afficher
     * @param {number} duration - Durée d'affichage en ms (défaut 4000)
     */
    error(message: string, duration = 4000): void {
        this._add(message, 'error', duration);
    }

    /**
     * Supprime un toast par son identifiant.
     * @param {number} id - Identifiant du toast à supprimer
     */
    remove(id: number): void {
        this.toasts.update((t) => t.filter((x) => x.id !== id));
    }

    private _add(message: string, type: 'success' | 'error', duration: number): void {
        const id = this.nextId++;
        this.toasts.update((t) => [...t, { id, message, type }]);
        setTimeout(() => this.remove(id), duration);
    }
}
