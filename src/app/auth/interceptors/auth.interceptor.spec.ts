import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
    let http: HttpClient;
    let httpMock: HttpTestingController;
    let routerSpy: { navigate: ReturnType<typeof vi.fn> };

    beforeEach(() => {
        localStorage.clear();
        routerSpy = { navigate: vi.fn() };
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptors([authInterceptor])),
                provideHttpClientTesting(),
                { provide: Router, useValue: routerSpy },
            ],
        });
        http = TestBed.inject(HttpClient);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
        localStorage.clear();
    });

    it('should add an Authorization header when a token is present', () => {
        localStorage.setItem('vs_token', 'my-jwt-token');

        http.get('/api/test').subscribe();

        const req = httpMock.expectOne('/api/test');
        expect(req.request.headers.get('Authorization')).toBe('Bearer my-jwt-token');
        req.flush({});
    });

    it('should not add an Authorization header when no token is present', () => {
        http.get('/api/test').subscribe();

        const req = httpMock.expectOne('/api/test');
        expect(req.request.headers.has('Authorization')).toBe(false);
        req.flush({});
    });

    it('should remove the token and navigate on 401 response', () => {
        localStorage.setItem('vs_token', 'some-token');

        http.get('/api/test').subscribe({
            error: (err) => {
                expect(err.status).toBe(401);
            },
        });

        const req = httpMock.expectOne('/api/test');
        req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

        expect(localStorage.getItem('vs_token')).toBeNull();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
    });

    it('should not remove the token on non-401 errors', () => {
        localStorage.setItem('vs_token', 'some-token');

        http.get('/api/test').subscribe({
            error: (err) => {
                expect(err.status).toBe(500);
            },
        });

        const req = httpMock.expectOne('/api/test');
        req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

        expect(localStorage.getItem('vs_token')).toBe('some-token');
        expect(routerSpy.navigate).not.toHaveBeenCalled();
    });
});
