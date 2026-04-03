import { CATEGORIES, getCategoryLabel, getCategoryColor } from './categories.constants';

describe('CATEGORIES', () => {
    it('should contain 12 categories', () => {
        expect(CATEGORIES.length).toBe(12);
    });

    it('should have unique keys', () => {
        const keys = CATEGORIES.map((c) => c.key);
        expect(new Set(keys).size).toBe(keys.length);
    });
});

describe('getCategoryLabel', () => {
    it('should return the label for a known key', () => {
        expect(getCategoryLabel('alimentation')).toBe('Alimentation');
    });

    it('should return the label for "salaire"', () => {
        expect(getCategoryLabel('salaire')).toBe('Salaire');
    });

    it('should return the label for "epargne"', () => {
        expect(getCategoryLabel('epargne')).toBe('Épargne');
    });

    it('should return the key itself for an unknown key', () => {
        expect(getCategoryLabel('unknown_category')).toBe('unknown_category');
    });

    it('should return the empty string for an empty key', () => {
        // ?? only checks null/undefined, not empty string
        expect(getCategoryLabel('')).toBe('');
    });
});

describe('getCategoryColor', () => {
    it('should return the correct color for "alimentation"', () => {
        expect(getCategoryColor('alimentation')).toBe('#F97316');
    });

    it('should return the correct color for "salaire"', () => {
        expect(getCategoryColor('salaire')).toBe('#10B981');
    });

    it('should return the fallback gray color for an unknown key', () => {
        expect(getCategoryColor('nonexistent')).toBe('#6B7280');
    });

    it('should return the fallback gray color for an empty string', () => {
        expect(getCategoryColor('')).toBe('#6B7280');
    });
});
