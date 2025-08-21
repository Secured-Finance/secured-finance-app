import { PriceFormatter } from './priceFormatter';

describe('PriceFormatter', () => {
    describe('formatUSD', () => {
        it('should format USD currency with default settings', () => {
            expect(PriceFormatter.formatUSD(1000)).toBe('$1,000');
            expect(PriceFormatter.formatUSD(BigInt(1000))).toBe('$1,000');
        });

        it('should format USD with specified digits', () => {
            expect(PriceFormatter.formatUSD(1000.567, 2)).toBe('$1,000.57');
        });
    });

    describe('formatPercentage', () => {
        it('should format percentage with default settings', () => {
            expect(PriceFormatter.formatPercentage(50)).toBe('50%');
            expect(PriceFormatter.formatPercentage(25, 100)).toBe('25%');
        });

        it('should handle custom divisor', () => {
            expect(PriceFormatter.formatPercentage(1000, 10000, 2, 2)).toBe(
                '10.00%'
            );
        });
    });

    describe('formatOrdinary', () => {
        it('should format numbers with thousand separators', () => {
            expect(PriceFormatter.formatOrdinary(1000)).toBe('1,000');
            expect(PriceFormatter.formatOrdinary(BigInt(1000000))).toBe(
                '1,000,000'
            );
        });

        it('should respect decimal settings', () => {
            expect(PriceFormatter.formatOrdinary(1000.567, 2, 2)).toBe(
                '1,000.57'
            );
        });
    });

    describe('formatAmount', () => {
        it('should format amounts with up to 4 decimals', () => {
            expect(PriceFormatter.formatAmount(1000.12345)).toBe('1,000.1235');
            expect(PriceFormatter.formatAmount(BigInt(1000))).toBe('1,000');
        });
    });

    describe('formatWithCurrency', () => {
        it('should format number with currency symbol', () => {
            expect(PriceFormatter.formatWithCurrency(1000.5, 'ETH')).toBe(
                '1,000.5 ETH'
            );
            expect(
                PriceFormatter.formatWithCurrency(BigInt(1000), 'BTC', 4)
            ).toBe('1,000 BTC');
        });
    });

    describe('formatToFixed', () => {
        it('should handle different input types', () => {
            expect(PriceFormatter.formatToFixed(100.567, 2)).toBe('100.57');
            expect(PriceFormatter.formatToFixed('100.567', 2)).toBe('100.57');
            expect(PriceFormatter.formatToFixed(BigInt(100), 2)).toBe('100.00');
        });
    });

    describe('formatPrice', () => {
        it('should format price by dividing by 100', () => {
            expect(PriceFormatter.formatPrice(9850, 2)).toBe('98.50');
            expect(PriceFormatter.formatPrice(10000, 4)).toBe('100.0000');
        });
    });

    describe('formatRate', () => {
        it('should format rate with percentage symbol', () => {
            expect(PriceFormatter.formatRate(5.25, 2)).toBe('5.25%');
            expect(PriceFormatter.formatRate(10, 0)).toBe('10%');
        });
    });
});
