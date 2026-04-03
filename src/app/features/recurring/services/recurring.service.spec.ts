import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { RecurringService } from './recurring.service';
import { RecurringOperation } from '../models/recurring.model';

describe('RecurringService', () => {
    let service: RecurringService;
    let httpMock: HttpTestingController;

    const BASE_URL = 'http://localhost:3000/recurring';

    const mockRecurring: RecurringOperation = {
        id: '1',
        label: 'Loyer',
        amount: 800,
        type: 'debit',
        frequency: 'monthly',
        dayOfMonth: 5,
        isActive: true,
        userId: 'user-1',
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(RecurringService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getAll', () => {
        it('should GET all recurring operations', () => {
            const mockList = [mockRecurring];

            service.getAll().subscribe((result) => {
                expect(result).toEqual(mockList);
                expect(result.length).toBe(1);
            });

            const req = httpMock.expectOne(BASE_URL);
            expect(req.request.method).toBe('GET');
            req.flush(mockList);
        });
    });

    describe('create', () => {
        it('should POST a new recurring operation', () => {
            const payload: Partial<RecurringOperation> = {
                label: 'Loyer',
                amount: 800,
                type: 'debit',
                frequency: 'monthly',
            };

            service.create(payload).subscribe((result) => {
                expect(result).toEqual(mockRecurring);
            });

            const req = httpMock.expectOne(BASE_URL);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(payload);
            req.flush(mockRecurring);
        });
    });

    describe('update', () => {
        it('should PATCH an existing recurring operation', () => {
            const payload: Partial<RecurringOperation> = { amount: 900 };
            const updated = { ...mockRecurring, amount: 900 };

            service.update('1', payload).subscribe((result) => {
                expect(result).toEqual(updated);
            });

            const req = httpMock.expectOne(`${BASE_URL}/1`);
            expect(req.request.method).toBe('PATCH');
            expect(req.request.body).toEqual(payload);
            req.flush(updated);
        });
    });

    describe('delete', () => {
        it('should DELETE a recurring operation by id', () => {
            service.delete('1').subscribe();

            const req = httpMock.expectOne(`${BASE_URL}/1`);
            expect(req.request.method).toBe('DELETE');
            req.flush(null);
        });
    });

    describe('toggle', () => {
        it('should PATCH with isActive=false to deactivate', () => {
            const toggled = { ...mockRecurring, isActive: false };

            service.toggle('1', false).subscribe((result) => {
                expect(result).toEqual(toggled);
            });

            const req = httpMock.expectOne(`${BASE_URL}/1`);
            expect(req.request.method).toBe('PATCH');
            expect(req.request.body).toEqual({ isActive: false });
            req.flush(toggled);
        });

        it('should PATCH with isActive=true to activate', () => {
            const toggled = { ...mockRecurring, isActive: true };

            service.toggle('1', true).subscribe((result) => {
                expect(result).toEqual(toggled);
            });

            const req = httpMock.expectOne(`${BASE_URL}/1`);
            expect(req.request.method).toBe('PATCH');
            expect(req.request.body).toEqual({ isActive: true });
            req.flush(toggled);
        });
    });
});
