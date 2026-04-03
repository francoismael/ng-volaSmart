import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        localStorage.clear();
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
        localStorage.clear();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('register', () => {
        it('should POST registration data and return the created user', () => {
            const payload = { username: 'john', email: 'john@test.com', password: 'secret' };
            const mockResponse = { id: '1', username: 'john', email: 'john@test.com' };

            service.register(payload).subscribe((result) => {
                expect(result).toEqual(mockResponse);
            });

            const req = httpMock.expectOne('http://localhost:3000/auth/register');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(payload);
            req.flush(mockResponse);
        });
    });

    describe('login', () => {
        it('should POST credentials and return an access token', () => {
            const payload = { username: 'john', password: 'secret' };
            const mockResponse = { access_token: 'jwt-token-123' };

            service.login(payload).subscribe((result) => {
                expect(result).toEqual(mockResponse);
            });

            const req = httpMock.expectOne('http://localhost:3000/auth/login');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(payload);
            req.flush(mockResponse);
        });

        it('should store the token in localStorage after login', () => {
            const payload = { username: 'john', password: 'secret' };
            const mockResponse = { access_token: 'jwt-token-123' };

            service.login(payload).subscribe(() => {
                expect(localStorage.getItem('vs_token')).toBe('jwt-token-123');
            });

            const req = httpMock.expectOne('http://localhost:3000/auth/login');
            req.flush(mockResponse);
        });
    });

    describe('logout', () => {
        it('should POST to logout endpoint', () => {
            service.logout().subscribe();

            const req = httpMock.expectOne('http://localhost:3000/auth/logout');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual({});
            req.flush(null);
        });

        it('should remove the token from localStorage after logout', () => {
            localStorage.setItem('vs_token', 'jwt-token-123');

            service.logout().subscribe(() => {
                expect(localStorage.getItem('vs_token')).toBeNull();
            });

            const req = httpMock.expectOne('http://localhost:3000/auth/logout');
            req.flush(null);
        });
    });

    describe('getProfile', () => {
        it('should GET the current user profile', () => {
            const mockProfile = { id: '1', username: 'john', email: 'john@test.com' };

            service.getProfile().subscribe((result) => {
                expect(result).toEqual(mockProfile);
            });

            const req = httpMock.expectOne('http://localhost:3000/auth/profile');
            expect(req.request.method).toBe('GET');
            req.flush(mockProfile);
        });
    });
});
