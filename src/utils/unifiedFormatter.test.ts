import {
    UnifiedFormatter,
    formatters,
    selectors,
    FormatType,
} from './unifiedFormatter';
import { LoanValue } from './entities';

describe('UnifiedFormatter', () => {
    const testTimestamp = 1678643696; // Mar 12, 2023 17:54:56 GMT

    describe('formatTimestamp', () => {
        it('should format all timestamp types', () => {
            const display = UnifiedFormatter.formatTimestamp(
                testTimestamp,
                'display'
            );
            const compact = UnifiedFormatter.formatTimestamp(
                testTimestamp,
                'compact'
            );
            const iso = UnifiedFormatter.formatTimestamp(testTimestamp, 'iso');

            expect(display).toMatch(/\d+\/\d+\/\d+,?\s+\d+:\d+/);
            expect(compact).toMatch(/\d{2}\/\d{2}\/\d{2}/);
            expect(iso).toMatch(
                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
            );
        });

        it('should handle relative time correctly', () => {
            const now = Math.floor(Date.now() / 1000);
            const future = now + 3600;

            expect(UnifiedFormatter.formatTimestamp(future, 'relative')).toBe(
                '+1h'
            );
            expect(UnifiedFormatter.formatTimestamp(now, 'relative')).toBe(
                'now'
            );
        });
    });

    describe('formatAmount', () => {
        it('should format all amount types', () => {
            const amount = 1234.5678;
            const bigAmount = BigInt('1234567890');

            expect(UnifiedFormatter.formatAmount(amount, 'display')).toBe(
                '1,234.5678'
            );
            expect(UnifiedFormatter.formatAmount(1234567, 'compact')).toBe(
                '1.2M'
            );
            expect(UnifiedFormatter.formatAmount(amount, 'iso')).toBe(
                '1234.5678'
            );
            expect(UnifiedFormatter.formatAmount(bigAmount, 'display')).toBe(
                '1,234,567,890'
            );
        });

        it('should handle currency and decimal options', () => {
            const withCurrency = UnifiedFormatter.formatAmount(
                1000,
                'display',
                {
                    showCurrency: true,
                    currency: 'ETH',
                    minDecimals: 2,
                }
            );
            expect(withCurrency).toBe('1,000.00 ETH');
        });
    });

    describe('formatPrice', () => {
        it('should format all price types', () => {
            const price = 1234.56;
            const loanValue = LoanValue.fromPrice(9650, 100);

            expect(UnifiedFormatter.formatPrice(price, 'display')).toBe(
                '$1,234.56'
            );
            expect(UnifiedFormatter.formatPrice(1234567, 'compact')).toBe(
                '$1M'
            );
            expect(
                UnifiedFormatter.formatPrice(50, 'display', {
                    type: 'percentage',
                })
            ).toBe('50%');
            expect(UnifiedFormatter.formatPrice(loanValue, 'display')).toBe(
                '$96.50'
            );
        });
    });

    describe('selectors and formatters', () => {
        it('should provide working selectors', () => {
            const displaySelector = selectors.displayTimestamp();
            const compactSelector = selectors.compactAmount();

            expect(displaySelector(testTimestamp)).toMatch(/\d+\/\d+\/\d+/);
            expect(compactSelector(1234567)).toBe('1.2M');
        });

        it('should provide formatters object', () => {
            expect(formatters.timestamp).toBe(UnifiedFormatter.formatTimestamp);
            expect(formatters.amount).toBe(UnifiedFormatter.formatAmount);
            expect(formatters.price).toBe(UnifiedFormatter.formatPrice);
        });
    });

    describe('error handling', () => {
        it('should throw errors for unsupported formats', () => {
            expect(() =>
                UnifiedFormatter.formatTimestamp(
                    testTimestamp,
                    'invalid' as FormatType
                )
            ).toThrow('Unsupported timestamp format');
            expect(() =>
                UnifiedFormatter.formatAmount(123, 'invalid' as FormatType)
            ).toThrow('Unsupported amount format');
            expect(() =>
                UnifiedFormatter.formatPrice(123, 'invalid' as FormatType)
            ).toThrow('Unsupported price format');
        });
    });
});
