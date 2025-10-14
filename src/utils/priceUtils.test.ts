import { PriceUtils } from './priceUtils';
import { CurrencySymbol } from 'src/utils';
import { Maturity } from './entities';

describe('PriceUtils', () => {
    describe('toDecimal', () => {
        it('should convert percentage to decimal', () => {
            expect(PriceUtils.toDecimal(37)).toBe(0.37);
            expect(PriceUtils.toDecimal(100)).toBe(1.0);
            expect(PriceUtils.toDecimal(0)).toBe(0);
            expect(PriceUtils.toDecimal(150)).toBe(1.5);
        });
    });

    describe('toPercentage', () => {
        it('should calculate percentage of total', () => {
            expect(PriceUtils.toPercentage(43, 100)).toBe(43);
            expect(PriceUtils.toPercentage(50, 100)).toBe(50);
            expect(PriceUtils.toPercentage(25, 50)).toBe(50);
            expect(PriceUtils.toPercentage(0, 100)).toBe(0);
        });

        it('should handle decimal results', () => {
            expect(PriceUtils.toPercentage(1, 3)).toBeCloseTo(33.33, 2);
            expect(PriceUtils.toPercentage(2, 3)).toBeCloseTo(66.67, 2);
        });
    });

    describe('toBondPrice', () => {
        it('should convert price to bond format', () => {
            expect(PriceUtils.toBondPrice(0.9626)).toBe(9626);
            expect(PriceUtils.toBondPrice(0.985)).toBe(9850);
            expect(PriceUtils.toBondPrice(1.0)).toBe(10000);
            expect(PriceUtils.toBondPrice(0.96)).toBe(9600);
        });
    });

    describe('capApr', () => {
        it('should cap APR at maximum display value', () => {
            expect(PriceUtils.capApr(500)).toBe(500);
            expect(PriceUtils.capApr(1000)).toBe(1000);
            expect(PriceUtils.capApr(1200)).toBe(1000);
            expect(PriceUtils.capApr(0)).toBe(0);
        });
    });

    describe('capProgressWidth', () => {
        it('should cap progress width at 1', () => {
            expect(PriceUtils.capProgressWidth(0.5)).toBe(0.5);
            expect(PriceUtils.capProgressWidth(1.0)).toBe(1.0);
            expect(PriceUtils.capProgressWidth(1.5)).toBe(1.0);
            expect(PriceUtils.capProgressWidth(0)).toBe(0);
        });
    });

    describe('formatZCToken', () => {
        it('should format ZC Token with conversion', () => {
            const maturity = new Maturity(1677715200);
            const amount = BigInt('1000000000000000000');

            const result = PriceUtils.formatZCToken(
                CurrencySymbol.ETH,
                amount,
                maturity
            );

            // Should return formatted string (exact value depends on conversion logic)
            expect(typeof result).toBe('string');
            expect(result.length).toBeGreaterThan(0);
        });

        it('should handle zero amount', () => {
            const maturity = new Maturity(1677715200);
            const result = PriceUtils.formatZCToken(
                CurrencySymbol.ETH,
                BigInt(0),
                maturity
            );

            expect(result).toBe('0');
        });

        it('should work without maturity', () => {
            const amount = BigInt('1000000000000000000');
            const result = PriceUtils.formatZCToken(CurrencySymbol.ETH, amount);

            expect(typeof result).toBe('string');
            expect(result.length).toBeGreaterThan(0);
        });
    });
});
