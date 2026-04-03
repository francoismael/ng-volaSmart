import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NotificationService } from './notification.service';
import { RecurringOperation } from '../../features/recurring/models/recurring.model';

describe('NotificationService', () => {
    let service: NotificationService;
    let httpMock: HttpTestingController;

    const today = new Date();
    const todayISO = today.toISOString().split('T')[0];

    function daysFromNow(days: number): string {
        const d = new Date();
        d.setUTCDate(d.getUTCDate() + days);
        return d.toISOString().split('T')[0];
    }

    function makeRecurring(overrides: Partial<RecurringOperation>): RecurringOperation {
        return {
            id: '1',
            label: 'Test',
            amount: 100,
            type: 'debit',
            frequency: 'monthly',
            isActive: true,
            nextDate: todayISO,
            userId: 'u1',
            ...overrides,
        };
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(NotificationService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should start with empty notifications and count of 0', () => {
        expect(service.notifications()).toEqual([]);
        expect(service.count()).toBe(0);
    });

    describe('load', () => {
        it('should load notifications for recurring items due within 3 days', () => {
            const items: RecurringOperation[] = [
                makeRecurring({ id: 'a', label: 'Rent', nextDate: daysFromNow(1) }),
                makeRecurring({ id: 'b', label: 'Phone', nextDate: daysFromNow(3) }),
            ];

            service.load();

            const req = httpMock.expectOne('http://localhost:3000/recurring');
            expect(req.request.method).toBe('GET');
            req.flush(items);

            expect(service.notifications().length).toBe(2);
            expect(service.count()).toBe(2);
        });

        it('should exclude items due more than 3 days from now', () => {
            const items: RecurringOperation[] = [makeRecurring({ id: 'a', label: 'Far away', nextDate: daysFromNow(5) })];

            service.load();

            const req = httpMock.expectOne('http://localhost:3000/recurring');
            req.flush(items);

            expect(service.notifications().length).toBe(0);
        });

        it('should exclude inactive items', () => {
            const items: RecurringOperation[] = [makeRecurring({ id: 'a', isActive: false, nextDate: daysFromNow(1) })];

            service.load();

            const req = httpMock.expectOne('http://localhost:3000/recurring');
            req.flush(items);

            expect(service.notifications().length).toBe(0);
        });

        it('should exclude items without a nextDate', () => {
            const items: RecurringOperation[] = [makeRecurring({ id: 'a', nextDate: undefined })];

            service.load();

            const req = httpMock.expectOne('http://localhost:3000/recurring');
            req.flush(items);

            expect(service.notifications().length).toBe(0);
        });

        it('should sort notifications by daysUntil ascending', () => {
            const items: RecurringOperation[] = [
                makeRecurring({ id: 'later', label: 'Later', nextDate: daysFromNow(3) }),
                makeRecurring({ id: 'sooner', label: 'Sooner', nextDate: daysFromNow(0) }),
                makeRecurring({ id: 'mid', label: 'Mid', nextDate: daysFromNow(2) }),
            ];

            service.load();

            const req = httpMock.expectOne('http://localhost:3000/recurring');
            req.flush(items);

            const labels = service.notifications().map((n) => n.label);
            expect(labels).toEqual(['Sooner', 'Mid', 'Later']);
        });

        it('should include past-due items (negative daysUntil)', () => {
            const items: RecurringOperation[] = [makeRecurring({ id: 'overdue', label: 'Overdue', nextDate: daysFromNow(-1) })];

            service.load();

            const req = httpMock.expectOne('http://localhost:3000/recurring');
            req.flush(items);

            expect(service.notifications().length).toBe(1);
            expect(service.notifications()[0].daysUntil).toBeLessThan(0);
        });

        it('should silently handle HTTP errors', () => {
            service.load();

            const req = httpMock.expectOne('http://localhost:3000/recurring');
            req.error(new ProgressEvent('error'));

            expect(service.notifications()).toEqual([]);
        });
    });
});
