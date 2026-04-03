import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { OperationsService, PaginatedOperations } from './operations.service';
import { Operation } from '../models/operation.model';

describe('OperationsService', () => {
    let service: OperationsService;
    let httpMock: HttpTestingController;

    const API_URL = 'http://localhost:3000/operations';

    const mockOperation: Operation = {
        id: '1',
        date: '2026-01-15',
        label: 'Courses',
        debit: 50,
        credit: 0,
        userId: 'user-1',
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(OperationsService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getAll', () => {
        it('should GET all operations without filters', () => {
            service.getAll().subscribe((result) => {
                expect(result).toEqual([mockOperation]);
            });

            const req = httpMock.expectOne(API_URL);
            expect(req.request.method).toBe('GET');
            expect(req.request.params.keys().length).toBe(0);
            req.flush([mockOperation]);
        });

        it('should GET operations with startDate filter', () => {
            service.getAll({ startDate: '2026-01-01' }).subscribe();

            const req = httpMock.expectOne((r) => r.url === API_URL);
            expect(req.request.params.get('startDate')).toBe('2026-01-01');
            expect(req.request.params.has('endDate')).toBe(false);
            req.flush([]);
        });

        it('should GET operations with both date filters', () => {
            service.getAll({ startDate: '2026-01-01', endDate: '2026-01-31' }).subscribe();

            const req = httpMock.expectOne((r) => r.url === API_URL);
            expect(req.request.params.get('startDate')).toBe('2026-01-01');
            expect(req.request.params.get('endDate')).toBe('2026-01-31');
            req.flush([]);
        });
    });

    describe('getAllPaginated', () => {
        const mockPaginated: PaginatedOperations = {
            data: [mockOperation],
            total: 1,
            page: 1,
            totalPages: 1,
            totalDebit: 50,
            totalCredit: 0,
        };

        it('should use default page=1 and limit=50 when no filters are provided', () => {
            service.getAllPaginated().subscribe((result) => {
                expect(result).toEqual(mockPaginated);
            });

            const req = httpMock.expectOne((r) => r.url === API_URL);
            expect(req.request.params.get('page')).toBe('1');
            expect(req.request.params.get('limit')).toBe('50');
            req.flush(mockPaginated);
        });

        it('should use custom page and limit values', () => {
            service.getAllPaginated({ page: 3, limit: 10 }).subscribe();

            const req = httpMock.expectOne((r) => r.url === API_URL);
            expect(req.request.params.get('page')).toBe('3');
            expect(req.request.params.get('limit')).toBe('10');
            req.flush(mockPaginated);
        });

        it('should include date filters when provided', () => {
            service.getAllPaginated({ startDate: '2026-01-01', endDate: '2026-01-31', page: 2, limit: 25 }).subscribe();

            const req = httpMock.expectOne((r) => r.url === API_URL);
            expect(req.request.params.get('startDate')).toBe('2026-01-01');
            expect(req.request.params.get('endDate')).toBe('2026-01-31');
            expect(req.request.params.get('page')).toBe('2');
            expect(req.request.params.get('limit')).toBe('25');
            req.flush(mockPaginated);
        });
    });

    describe('getById', () => {
        it('should GET a single operation by id', () => {
            service.getById('1').subscribe((result) => {
                expect(result).toEqual(mockOperation);
            });

            const req = httpMock.expectOne(`${API_URL}/1`);
            expect(req.request.method).toBe('GET');
            req.flush(mockOperation);
        });
    });

    describe('create', () => {
        it('should POST a new operation', () => {
            const payload: Partial<Operation> = { label: 'Courses', debit: 50, credit: 0 };

            service.create(payload).subscribe((result) => {
                expect(result).toEqual(mockOperation);
            });

            const req = httpMock.expectOne(API_URL);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(payload);
            req.flush(mockOperation);
        });
    });

    describe('update', () => {
        it('should PATCH an existing operation', () => {
            const payload: Partial<Operation> = { label: 'Courses modifiees' };

            service.update('1', payload).subscribe((result) => {
                expect(result).toEqual({ ...mockOperation, label: 'Courses modifiees' });
            });

            const req = httpMock.expectOne(`${API_URL}/1`);
            expect(req.request.method).toBe('PATCH');
            expect(req.request.body).toEqual(payload);
            req.flush({ ...mockOperation, label: 'Courses modifiees' });
        });
    });

    describe('delete', () => {
        it('should DELETE an operation by id', () => {
            service.delete('1').subscribe();

            const req = httpMock.expectOne(`${API_URL}/1`);
            expect(req.request.method).toBe('DELETE');
            req.flush(null);
        });
    });
});
