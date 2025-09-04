import { PriceFormatter } from './priceFormatter';

describe('PriceFormatter', () => {
    describe('formatUSD', () => {
        it('should format USD currency with default settings', () => {
            expect(PriceFormatter.formatUSDValue(1000)).toBe('$1,000.00');
            expect(PriceFormatter.formatUSDValue(BigInt(1000))).toBe(
                '$1,000.00'
            );
        });

        it('should format USD with specified digits', () => {
            expect(PriceFormatter.formatUSD(1000.567, 1, 2)).toBe('$1,000.57');
        });
    });

    describe('formatUSDValue', () => {
        it('should format pre-calculated USD values', () => {
            expect(PriceFormatter.formatUSDValue(1000)).toBe('$1,000.00');
            expect(PriceFormatter.formatUSDValue(1000.567)).toBe('$1,000.57');
        });

        it('should handle compact notation for USD values', () => {
            expect(PriceFormatter.formatUSDValue(1000000, 0, 'compact')).toBe(
                '$1M'
            );
        });

        it('should preserve BigInt precision for USD values', () => {
            expect(
                PriceFormatter.formatUSDValue(BigInt('123456789123456789'))
            ).toBe('$123,456,789,123,456,789.00');
        });
    });

    describe('formatPercentage', () => {
        it('should format percentage with default settings', () => {
            expect(PriceFormatter.formatPercentage(50)).toBe('50%');
            expect(PriceFormatter.formatPercentage(25, 'percentage')).toBe(
                '25%'
            );
        });

        it('should handle raw unit', () => {
            expect(PriceFormatter.formatPercentage(0.1, 'raw', 2, 2)).toBe(
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
            expect(PriceFormatter.formatPrice(9850, 'percentage', 2)).toBe(
                '98.50'
            );
            expect(PriceFormatter.formatPrice(10000, 'percentage', 4)).toBe(
                '100.0000'
            );
        });
    });

    describe('formatRate', () => {
        it('should format rate with percentage symbol', () => {
            expect(PriceFormatter.formatRate(5.25, 2)).toBe('5.25%');
            expect(PriceFormatter.formatRate(10, 0)).toBe('10%');
        });
    });
});
