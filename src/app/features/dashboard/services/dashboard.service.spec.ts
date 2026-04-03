import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DashboardService, DashboardData } from './dashboard.service';

describe('DashboardService', () => {
    let service: DashboardService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(DashboardService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getDashboard', () => {
        it('should GET dashboard data from the correct URL', () => {
            const mockData: DashboardData = {
                initialBalance: 10000,
                totalCredit: 5000,
                totalDebit: 3000,
                currentBalance: 12000,
                todayDebit: 100,
                todayCredit: 200,
                weekDebit: 500,
                weekCredit: 800,
                monthDebit: 2000,
                monthCredit: 3000,
                yearDebit: 3000,
                yearCredit: 5000,
                recentOperations: [
                    {
                        id: '1',
                        label: 'Salaire',
                        amount: 2500,
                        type: 'credit',
                        date: '2026-04-01',
                        category: 'salaire',
                        debit: 0,
                        credit: 2500,
                    },
                ],
            };

            service.getDashboard().subscribe((result) => {
                expect(result).toEqual(mockData);
            });

            const req = httpMock.expectOne('http://localhost:3000/dashboard');
            expect(req.request.method).toBe('GET');
            req.flush(mockData);
        });

        it('should return an empty recentOperations array when there are no operations', () => {
            const mockData: DashboardData = {
                initialBalance: 0,
                totalCredit: 0,
                totalDebit: 0,
                currentBalance: 0,
                todayDebit: 0,
                todayCredit: 0,
                weekDebit: 0,
                weekCredit: 0,
                monthDebit: 0,
                monthCredit: 0,
                yearDebit: 0,
                yearCredit: 0,
                recentOperations: [],
            };

            service.getDashboard().subscribe((result) => {
                expect(result.recentOperations).toEqual([]);
            });

            const req = httpMock.expectOne('http://localhost:3000/dashboard');
            req.flush(mockData);
        });
    });
});
