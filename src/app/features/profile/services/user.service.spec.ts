import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
    let service: UserService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(UserService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getProfile', () => {
        it('should GET the user profile from the correct URL', () => {
            const mockProfile = { id: '1', username: 'ismael', email: 'ismael@test.com' };

            service.getProfile().subscribe((result) => {
                expect(result).toEqual(mockProfile);
            });

            const req = httpMock.expectOne('http://localhost:3000/auth/profile');
            expect(req.request.method).toBe('GET');
            req.flush(mockProfile);
        });

        it('should return the expected profile shape', () => {
            const mockProfile = { id: '42', username: 'admin', email: 'admin@volasmart.com' };

            service.getProfile().subscribe((result) => {
                expect(result.id).toBe('42');
                expect(result.username).toBe('admin');
                expect(result.email).toBe('admin@volasmart.com');
            });

            const req = httpMock.expectOne('http://localhost:3000/auth/profile');
            req.flush(mockProfile);
        });
    });
});
