import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
    let service: ToastService;

    beforeEach(() => {
        vi.useFakeTimers();
        TestBed.configureTestingModule({ providers: [] });
        service = TestBed.inject(ToastService);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should start with an empty toasts array', () => {
        expect(service.toasts()).toEqual([]);
    });

    describe('success', () => {
        it('should add a success toast', () => {
            service.success('Operation OK');

            const toasts = service.toasts();
            expect(toasts.length).toBe(1);
            expect(toasts[0].message).toBe('Operation OK');
            expect(toasts[0].type).toBe('success');
        });

        it('should auto-remove the toast after the default duration (3500ms)', () => {
            service.success('Temporary');

            expect(service.toasts().length).toBe(1);

            vi.advanceTimersByTime(3500);

            expect(service.toasts().length).toBe(0);
        });

        it('should auto-remove the toast after a custom duration', () => {
            service.success('Custom', 1000);

            expect(service.toasts().length).toBe(1);

            vi.advanceTimersByTime(1000);

            expect(service.toasts().length).toBe(0);
        });
    });

    describe('error', () => {
        it('should add an error toast', () => {
            service.error('Something went wrong');

            const toasts = service.toasts();
            expect(toasts.length).toBe(1);
            expect(toasts[0].message).toBe('Something went wrong');
            expect(toasts[0].type).toBe('error');
        });

        it('should auto-remove the error toast after the default duration (4000ms)', () => {
            service.error('Temporary error');

            expect(service.toasts().length).toBe(1);

            vi.advanceTimersByTime(4000);

            expect(service.toasts().length).toBe(0);
        });
    });

    describe('remove', () => {
        it('should remove a toast by id', () => {
            service.success('First');
            service.error('Second');

            const firstId = service.toasts()[0].id;
            service.remove(firstId);

            const remaining = service.toasts();
            expect(remaining.length).toBe(1);
            expect(remaining[0].message).toBe('Second');
        });

        it('should do nothing when removing a non-existent id', () => {
            service.success('Still here');

            service.remove(999);

            expect(service.toasts().length).toBe(1);
        });
    });

    describe('multiple toasts', () => {
        it('should support multiple toasts simultaneously', () => {
            service.success('A');
            service.success('B');
            service.error('C');

            expect(service.toasts().length).toBe(3);
        });

        it('should assign unique ids to each toast', () => {
            service.success('A');
            service.success('B');

            const ids = service.toasts().map((t) => t.id);
            expect(ids[0]).not.toBe(ids[1]);
        });
    });
});
