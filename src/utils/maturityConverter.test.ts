import { MaturityConverter } from './maturityConverter';
import { Maturity } from './entities';

describe('MaturityConverter', () => {
    const testTimestamp = 1735689600; // 2025-01-01 00:00:00 UTC
    const testMaturity = new Maturity(testTimestamp);

    describe('fromInput', () => {
        it('should create Maturity from string', () => {
            const result = MaturityConverter.fromInput('1735689600');
            expect(result).toBeInstanceOf(Maturity);
            expect(result.toNumber()).toBe(1735689600);
        });

        it('should create Maturity from number', () => {
            const result = MaturityConverter.fromInput(1735689600);
            expect(result).toBeInstanceOf(Maturity);
            expect(result.toNumber()).toBe(1735689600);
        });

        it('should create Maturity from bigint', () => {
            const result = MaturityConverter.fromInput(BigInt(1735689600));
            expect(result).toBeInstanceOf(Maturity);
            expect(result.toNumber()).toBe(1735689600);
        });
    });

    describe('toNumber', () => {
        it('should convert Maturity to number', () => {
            const result = MaturityConverter.toNumber(testMaturity);
            expect(result).toBe(testTimestamp);
        });
    });

    describe('toString', () => {
        it('should convert Maturity to string', () => {
            const result = MaturityConverter.toString(testMaturity);
            expect(result).toBe(testTimestamp.toString());
        });
    });

    describe('toUTCMonthYear', () => {
        it('should format timestamp as UTC month/year', () => {
            const result = MaturityConverter.toUTCMonthYear(testTimestamp);
            expect(result).toBe('JAN25');
        });

        it('should format with numeric year', () => {
            const result = MaturityConverter.toUTCMonthYear(
                testTimestamp,
                true
            );
            expect(result).toBe('JAN2025');
        });

        it('should handle string input', () => {
            const result = MaturityConverter.toUTCMonthYear('1735689600');
            expect(result).toBe('JAN25');
        });

        it('should handle Maturity object input', () => {
            const result = MaturityConverter.toUTCMonthYear(testMaturity);
            expect(result).toBe('JAN25');
        });
    });

    describe('toDateString', () => {
        it('should format timestamp as date string', () => {
            const result = MaturityConverter.toDateString(testTimestamp);
            expect(result).toBe('Jan 1, 2025');
        });

        it('should handle string input', () => {
            const result = MaturityConverter.toDateString('1735689600');
            expect(result).toBe('Jan 1, 2025');
        });

        it('should handle Maturity object input', () => {
            const result = MaturityConverter.toDateString(testMaturity);
            expect(result).toBe('Jan 1, 2025');
        });
    });
});
