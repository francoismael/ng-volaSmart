import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LedgerService, LedgerData } from './ledger.service';

describe('LedgerService', () => {
    let service: LedgerService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(LedgerService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getLedger', () => {
        it('should GET ledger data from the correct URL', () => {
            const mockData: LedgerData = {
                operations: [
                    {
                        id: '1',
                        label: 'Courses',
                        date: '2026-04-01',
                        category: 'alimentation',
                        debit: 50,
                        credit: 0,
                        userId: 'u1',
                    },
                ],
                totalDebit: 50,
                totalCredit: 0,
                balance: -50,
            };

            service.getLedger().subscribe((result) => {
                expect(result).toEqual(mockData);
                expect(result.operations.length).toBe(1);
            });

            const req = httpMock.expectOne('http://localhost:3000/ledger');
            expect(req.request.method).toBe('GET');
            req.flush(mockData);
        });

        it('should handle an empty ledger', () => {
            const mockData: LedgerData = {
                operations: [],
                totalDebit: 0,
                totalCredit: 0,
                balance: 0,
            };

            service.getLedger().subscribe((result) => {
                expect(result.operations).toEqual([]);
                expect(result.balance).toBe(0);
            });

            const req = httpMock.expectOne('http://localhost:3000/ledger');
            req.flush(mockData);
        });
    });
});
