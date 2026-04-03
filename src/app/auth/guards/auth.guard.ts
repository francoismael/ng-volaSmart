import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

/**
 * Garde de route vérifiant la présence et la validité du token JWT.
 * Redirige vers la page de connexion si le token est absent ou expiré.
 */
export const authGuard: CanActivateFn = () => {
    const router = inject(Router);
    const token = localStorage.getItem('vs_token');
    if (token && !isTokenExpired(token)) return true;
    localStorage.removeItem('vs_token');
    return router.createUrlTree(['/auth/login']);
};

function isTokenExpired(token: string): boolean {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
    } catch {
        return true;
    }
}
