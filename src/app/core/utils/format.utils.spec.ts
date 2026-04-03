import { formatAmount, formatCompact } from './format.utils';

describe('formatAmount', () => {
    it('should format zero', () => {
        expect(formatAmount(0)).toBe('0');
    });

    it('should format small positive numbers', () => {
        expect(formatAmount(42)).toBe('42');
    });

    it('should format thousands with a non-breaking space separator', () => {
        const result = formatAmount(1250);
        // fr-FR uses narrow no-break space (U+202F) as thousands separator
        expect(result.replace(/\s/g, ' ')).toBe('1 250');
    });

    it('should format large numbers with separators', () => {
        const result = formatAmount(1000000);
        expect(result.replace(/\s/g, ' ')).toBe('1 000 000');
    });

    it('should format negative numbers', () => {
        const result = formatAmount(-5000);
        // Remove special unicode chars for assertion
        const normalized = result.replace(/[^\d\s-]/g, '').replace(/\s/g, ' ');
        expect(normalized.trim()).toContain('5 000');
    });

    it('should round decimals (no fraction digits)', () => {
        const result = formatAmount(1234.56);
        expect(result.replace(/\s/g, ' ')).toBe('1 235');
    });

    it('should handle null/undefined by returning "0"', () => {
        expect(formatAmount(null as unknown as number)).toBe('0');
        expect(formatAmount(undefined as unknown as number)).toBe('0');
    });
});

describe('formatCompact', () => {
    it('should format zero', () => {
        expect(formatCompact(0)).toBe('0');
    });

    it('should format small numbers as-is', () => {
        expect(formatCompact(500)).toBe('500');
    });

    it('should format 999 as-is', () => {
        expect(formatCompact(999)).toBe('999');
    });

    it('should format 1000 as 1K', () => {
        expect(formatCompact(1000)).toBe('1K');
    });

    it('should format thousands with K suffix', () => {
        expect(formatCompact(5500)).toBe('6K');
    });

    it('should format 350000 as 350K', () => {
        expect(formatCompact(350000)).toBe('350K');
    });

    it('should format 1000000 as 1.0M', () => {
        expect(formatCompact(1000000)).toBe('1.0M');
    });

    it('should format millions with one decimal', () => {
        expect(formatCompact(1200000)).toBe('1.2M');
    });

    it('should format large millions', () => {
        expect(formatCompact(55500000)).toBe('55.5M');
    });

    it('should format negative numbers below 1000', () => {
        expect(formatCompact(-50)).toBe('-50');
    });
});
