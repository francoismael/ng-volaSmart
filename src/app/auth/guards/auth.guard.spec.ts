import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
    let router: Router;

    /** Creates a non-expired JWT payload (exp = 1 hour from now). */
    function makeValidToken(): string {
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify({ sub: '1', exp: Math.floor(Date.now() / 1000) + 3600 }));
        return `${header}.${payload}.signature`;
    }

    /** Creates an expired JWT payload (exp = 1 hour ago). */
    function makeExpiredToken(): string {
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify({ sub: '1', exp: Math.floor(Date.now() / 1000) - 3600 }));
        return `${header}.${payload}.signature`;
    }

    beforeEach(() => {
        localStorage.clear();
        TestBed.configureTestingModule({});
        router = TestBed.inject(Router);
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('should allow access when a valid token is present', () => {
        localStorage.setItem('vs_token', makeValidToken());

        const result = TestBed.runInInjectionContext(() => authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

        expect(result).toBe(true);
    });

    it('should redirect to /auth/login when no token is present', () => {
        const result = TestBed.runInInjectionContext(() => authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

        expect(result).toBeInstanceOf(UrlTree);
        expect((result as UrlTree).toString()).toBe('/auth/login');
    });

    it('should redirect to /auth/login when the token is expired', () => {
        localStorage.setItem('vs_token', makeExpiredToken());

        const result = TestBed.runInInjectionContext(() => authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

        expect(result).toBeInstanceOf(UrlTree);
        expect((result as UrlTree).toString()).toBe('/auth/login');
    });

    it('should remove the token from localStorage when it is expired', () => {
        localStorage.setItem('vs_token', makeExpiredToken());

        TestBed.runInInjectionContext(() => authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

        expect(localStorage.getItem('vs_token')).toBeNull();
    });

    it('should redirect when the token has an invalid format', () => {
        localStorage.setItem('vs_token', 'not-a-jwt');

        const result = TestBed.runInInjectionContext(() => authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

        expect(result).toBeInstanceOf(UrlTree);
    });
});
