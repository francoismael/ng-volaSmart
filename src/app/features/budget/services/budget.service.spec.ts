import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { BudgetService, BudgetLine, BudgetSummaryItem } from './budget.service';

describe('BudgetService', () => {
    let service: BudgetService;
    let httpMock: HttpTestingController;

    const BASE_URL = 'http://localhost:3000/budgets';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(BudgetService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getSummary', () => {
        it('should GET the budget summary for a given month', () => {
            const mockSummary: BudgetSummaryItem[] = [
                { category: 'Nourriture', budgeted: 300, spent: 150, remaining: 150, pct: 50 },
                { category: 'Transport', budgeted: 100, spent: 80, remaining: 20, pct: 80 },
            ];

            service.getSummary('2026-04').subscribe((result) => {
                expect(result).toEqual(mockSummary);
                expect(result.length).toBe(2);
            });

            const req = httpMock.expectOne((r) => r.url === `${BASE_URL}/summary`);
            expect(req.request.method).toBe('GET');
            expect(req.request.params.get('month')).toBe('2026-04');
            req.flush(mockSummary);
        });
    });

    describe('upsert', () => {
        it('should PUT a budget line and return the saved line', () => {
            const line: BudgetLine = { category: 'Nourriture', amount: 300, month: '2026-04' };

            service.upsert(line).subscribe((result) => {
                expect(result).toEqual(line);
            });

            const req = httpMock.expectOne(BASE_URL);
            expect(req.request.method).toBe('PUT');
            expect(req.request.body).toEqual(line);
            req.flush(line);
        });
    });

    describe('delete', () => {
        it('should DELETE a budget line by month and category', () => {
            service.delete('2026-04', 'Nourriture').subscribe();

            const req = httpMock.expectOne(`${BASE_URL}/2026-04/Nourriture`);
            expect(req.request.method).toBe('DELETE');
            req.flush(null);
        });
    });
});
