import { TimestampConverter } from './timestampConverter';

describe('TimestampConverter', () => {
    const TEST_TIMESTAMP = 1672531200; // Jan 1, 2023 00:00:00 UTC
    const TEST_DATE = new Date('2023-01-01T00:00:00.000Z');

    describe('toDate', () => {
        it('should convert Unix timestamp to Date', () => {
            const result = TimestampConverter.toDate(TEST_TIMESTAMP);
            expect(result).toEqual(TEST_DATE);
        });

        it('should handle zero timestamp', () => {
            const result = TimestampConverter.toDate(0);
            expect(result).toEqual(new Date('1970-01-01T00:00:00.000Z'));
        });
    });

    describe('toNumber', () => {
        it('should convert string to number', () => {
            expect(TimestampConverter.toNumber('123')).toBe(123);
        });

        it('should return number as is', () => {
            expect(TimestampConverter.toNumber(456)).toBe(456);
        });

        it('should handle BigInt string', () => {
            expect(TimestampConverter.toNumber('1672531200')).toBe(1672531200);
        });
    });

    describe('formatTimestamp', () => {
        it('should format timestamp with date and time', () => {
            const result = TimestampConverter.formatTimestamp(TEST_TIMESTAMP);
            expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{2,4}.*\d{1,2}:\d{2}/);
        });
    });

    describe('formatTimestampDDMMYY', () => {
        it('should format timestamp in DD/MM/YY, HH:MM format', () => {
            const result =
                TimestampConverter.formatTimestampDDMMYY(TEST_TIMESTAMP);
            expect(result).toMatch(/\d{2}\/\d{2}\/\d{2}, \d{2}:\d{2}/);
        });
    });

    describe('formatTimestampWithMonth', () => {
        it('should format timestamp with month name', () => {
            const result =
                TimestampConverter.formatTimestampWithMonth(TEST_TIMESTAMP);
            expect(result).toMatch(
                /[A-Za-z]{3} \d{1,2}, \d{4} \d{2}:\d{2}:\d{2}/
            );
        });
    });

    describe('formatTimeStampWithTimezone', () => {
        it('should format timestamp with timezone info', () => {
            const result =
                TimestampConverter.formatTimeStampWithTimezone(TEST_TIMESTAMP);
            expect(result).toMatch(/\d{2}:\d{2}:\d{2}/);
        });
    });

    describe('formatMaturity', () => {
        const CURRENT_TIME = Date.now();
        const FUTURE_TIMESTAMP = Math.floor(CURRENT_TIME / 1000) + 86400; // 1 day later

        it('should calculate day difference', () => {
            const result = TimestampConverter.formatMaturity(
                FUTURE_TIMESTAMP,
                'day',
                CURRENT_TIME
            );
            expect(result).toBeCloseTo(1, 0);
        });

        it('should calculate hour difference', () => {
            const result = TimestampConverter.formatMaturity(
                FUTURE_TIMESTAMP,
                'hours',
                CURRENT_TIME
            );
            expect(result).toBeCloseTo(24, 0);
        });

        it('should calculate minute difference', () => {
            const result = TimestampConverter.formatMaturity(
                FUTURE_TIMESTAMP,
                'minutes',
                CURRENT_TIME
            );
            expect(result).toBeCloseTo(1440, 0);
        });
    });

    describe('calculateTimeDifference', () => {
        it('should calculate time difference in milliseconds', () => {
            const now = Date.now();
            const pastTimestamp = Math.floor(now / 1000) - 3600; // 1 hour ago
            const result =
                TimestampConverter.calculateTimeDifference(pastTimestamp);
            expect(result).toBeCloseTo(3600000, -3); // ~1 hour in milliseconds
        });
    });

    describe('getCurrentTimestamp', () => {
        it('should return current Unix timestamp', () => {
            const result = TimestampConverter.getCurrentTimestamp();
            const now = Math.floor(Date.now() / 1000);
            expect(result).toBeCloseTo(now, 0);
        });
    });
});
