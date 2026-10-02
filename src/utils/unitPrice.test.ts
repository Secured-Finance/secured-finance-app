import {
    DEFAULT_ORDER_UNIT_PRICE_RANGE,
    formatUnitPrice,
    fromUnitPrice,
    toUnitPrice,
} from './unitPrice';

describe('unit price utilities', () => {
    it('defines the full order unit price range', () => {
        expect(DEFAULT_ORDER_UNIT_PRICE_RANGE).toEqual({
            min: 1,
            max: 10000,
        });
    });

    it('converts a displayed price to a unit price without floating-point precision errors', () => {
        expect(toUnitPrice(79.99)).toBe(7999);
    });

    it('converts a unit price to a displayed price', () => {
        expect(fromUnitPrice(9690)).toBe(96.9);
        expect(fromUnitPrice(BigInt(1))).toBe(0.01);
    });

    it('formats a unit price without unnecessary trailing zeros', () => {
        expect(formatUnitPrice(9600)).toBe('96');
        expect(formatUnitPrice(9690)).toBe('96.9');
        expect(formatUnitPrice(9698)).toBe('96.98');
    });
});
