import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AccountsService } from './accounts.service';
import { Account } from '../models/account.model';

describe('AccountsService', () => {
    let service: AccountsService;
    let httpMock: HttpTestingController;

    const API_URL = 'http://localhost:3000/accounts';

    const mockAccount: Account = {
        id: '1',
        name: 'Compte courant',
        type: 'banque',
        userId: 'user-1',
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(AccountsService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getAll', () => {
        it('should GET all accounts', () => {
            const mockAccounts: Account[] = [mockAccount];

            service.getAll().subscribe((result) => {
                expect(result).toEqual(mockAccounts);
                expect(result.length).toBe(1);
            });

            const req = httpMock.expectOne(API_URL);
            expect(req.request.method).toBe('GET');
            req.flush(mockAccounts);
        });
    });

    describe('create', () => {
        it('should POST a new account and return the created account', () => {
            const payload: Partial<Account> = { name: 'Epargne', type: 'banque' };

            service.create(payload).subscribe((result) => {
                expect(result).toEqual(mockAccount);
            });

            const req = httpMock.expectOne(API_URL);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(payload);
            req.flush(mockAccount);
        });
    });

    describe('update', () => {
        it('should PATCH the account and return the updated account', () => {
            const payload: Partial<Account> = { name: 'Compte modifie' };

            service.update('1', payload).subscribe((result) => {
                expect(result).toEqual({ ...mockAccount, name: 'Compte modifie' });
            });

            const req = httpMock.expectOne(`${API_URL}/1`);
            expect(req.request.method).toBe('PATCH');
            expect(req.request.body).toEqual(payload);
            req.flush({ ...mockAccount, name: 'Compte modifie' });
        });
    });

    describe('delete', () => {
        it('should DELETE the account by id', () => {
            service.delete('1').subscribe();

            const req = httpMock.expectOne(`${API_URL}/1`);
            expect(req.request.method).toBe('DELETE');
            req.flush(null);
        });
    });
});
