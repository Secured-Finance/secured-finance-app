import { UnifiedFormatter, formatter } from './unifiedFormatter';
import { LoanValue } from './entities';

describe('UnifiedFormatter', () => {
    describe('formatAmount', () => {
        it('should format amounts with specified decimals', () => {
            expect(UnifiedFormatter.formatAmount(1234.5678, 0, 2)).toBe(
                '1,234.57'
            );
            expect(UnifiedFormatter.formatAmount(1234.5678, 0, 4)).toBe(
                '1,234.5678'
            );
            expect(UnifiedFormatter.formatAmount(BigInt(123456789), 0, 0)).toBe(
                '123,456,789'
            );
        });

        it('should format with compact notation', () => {
            expect(
                UnifiedFormatter.formatAmount(1234567, 0, 2, 'compact')
            ).toBe('1.23M');
        });
    });

    describe('formatUSD', () => {
        it('should format USD currency', () => {
            expect(UnifiedFormatter.formatUSD(1234.56, 2)).toBe('$1,234.56');
            expect(UnifiedFormatter.formatUSD(1234, 0)).toBe('$1,234');
            expect(UnifiedFormatter.formatUSD(1234567, 0, 'compact')).toBe(
                '$1M'
            );
        });
    });

    describe('formatPercentage', () => {
        it('should format percentages correctly', () => {
            // dividedBy=10000 (basis points): 3700/10000 = 0.37 = 37%
            expect(UnifiedFormatter.formatPercentage(3700, 2, 10000)).toBe(
                '37.00%'
            );
            expect(UnifiedFormatter.formatPercentage(5000, 2, 10000)).toBe(
                '50.00%'
            );
            // dividedBy=100 (percentage points): 43/100 = 0.43 = 43%
            expect(UnifiedFormatter.formatPercentage(43, 2, 100)).toBe(
                '43.00%'
            );
            // dividedBy=1 (raw decimal): 0.43 = 43%
            expect(UnifiedFormatter.formatPercentage(0.43, 2, 1)).toBe(
                '43.00%'
            );
        });
    });

    describe('formatLoanValue', () => {
        it('should format loan value prices', () => {
            const loanValue = LoanValue.fromPrice(9650, 100);
            expect(
                UnifiedFormatter.formatLoanValue(loanValue, 'price', 2)
            ).toBe('96.50');
        });

        it('should return default values for undefined loan values', () => {
            expect(UnifiedFormatter.formatLoanValue(undefined, 'price')).toBe(
                '--.--'
            );
            expect(UnifiedFormatter.formatLoanValue(undefined, 'rate')).toBe(
                '--.--%'
            );
        });
    });

    describe('formatter object', () => {
        it('should provide working formatter functions', () => {
            expect(formatter.usd(1000, 2)).toBe('$1,000.00');
            expect(formatter.ordinary(0, 2)(1234.567)).toBe('1,234.57');
            expect(formatter.percentage(3700, 2, 10000)).toBe('37.00%');
            expect(formatter.percentage(43, 2, 100)).toBe('43.00%');
            expect(formatter.percentage(0.43, 2, 1)).toBe('43.00%');
        });
    });
});
