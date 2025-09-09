import timemachine from 'timemachine';
import { TimestampConverter } from './timestampConverter';

describe('TimestampConverter', () => {
    beforeAll(() => {
        timemachine.config({
            dateString: '2023-01-01T00:00:00.000Z',
        });
    });

    afterAll(() => {
        timemachine.reset();
    });

    const TEST_TIMESTAMP = 1672531200;
    const TEST_DATE = new Date('2023-01-01T00:00:00.000Z');
    const OLD_TIMESTAMPS = [0, 86400, 1671859344];
    const OLD_DDMMYY_CASES = [
        { unixTimestamp: 1609459200, expected: '01/01/21, 00:00' },
        { unixTimestamp: 1612137600, expected: '01/02/21, 00:00' },
        { unixTimestamp: 1625097600, expected: '01/07/21, 00:00' },
        { unixTimestamp: 1657964207, expected: '16/07/22, 09:36' },
    ];
    const OLD_WITH_MONTH_CASES = [
        { timestamp: 0, expected: 'Jan 1, 1970 00:00:00' },
        { timestamp: 86400, expected: 'Jan 2, 1970 00:00:00' },
        { timestamp: 1671859344, expected: 'Dec 24, 2022 05:22:24' },
    ];

    describe('toDate', () => {
        it('should convert Unix timestamp to Date', () => {
            expect(TimestampConverter.toDate(TEST_TIMESTAMP)).toEqual(
                TEST_DATE
            );
        });

        it('should handle zero timestamp', () => {
            expect(TimestampConverter.toDate(0)).toEqual(
                new Date('1970-01-01T00:00:00.000Z')
            );
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
            expect(TimestampConverter.toNumber(1672531200n)).toBe(1672531200);
        });
    });

    describe('formatTimestamp', () => {
        OLD_TIMESTAMPS.forEach(ts => {
            it(`should format ${ts} in user timezone`, () => {
                const date = new Date(ts * 1000);
                const formattedDate = new Intl.DateTimeFormat(undefined, {
                    dateStyle: 'short',
                    timeStyle: 'short',
                }).format(date);
                expect(TimestampConverter.formatTimestamp(ts)).toEqual(
                    formattedDate
                );
            });
        });
    });

    describe('formatTimestampDDMMYY', () => {
        OLD_DDMMYY_CASES.forEach(({ unixTimestamp, expected }) => {
            it(`should format ${unixTimestamp} as ${expected}`, () => {
                expect(
                    TimestampConverter.formatTimestampDDMMYY(unixTimestamp)
                ).toBe(expected);
            });
        });

        it('should return empty string for undefined or null', () => {
            expect(TimestampConverter.formatTimestampDDMMYY(undefined)).toBe(
                ''
            );
        });

        it('should return "--" for invalid timestamp', () => {
            expect(TimestampConverter.formatTimestampDDMMYY('abc')).toBe('--');
            expect(TimestampConverter.formatTimestampDDMMYY(0)).toBe('--');
        });
    });

    describe('formatTimestampWithMonth', () => {
        OLD_WITH_MONTH_CASES.forEach(({ timestamp, expected }) => {
            it(`should format ${timestamp} as ${expected}`, () => {
                expect(
                    TimestampConverter.formatTimestampWithMonth(timestamp)
                ).toBe(expected);
            });
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
        const CURRENT_TIME = TimestampConverter.getCurrentTimestamp();
        const FUTURE_TIMESTAMP = CURRENT_TIME + 86400;

        it('should calculate day difference', () => {
            expect(
                TimestampConverter.formatMaturity(
                    FUTURE_TIMESTAMP,
                    'day',
                    CURRENT_TIME
                )
            ).toBeCloseTo(1, 0);
        });

        it('should calculate hour difference', () => {
            expect(
                TimestampConverter.formatMaturity(
                    FUTURE_TIMESTAMP,
                    'hours',
                    CURRENT_TIME
                )
            ).toBeCloseTo(24, 0);
        });

        it('should calculate minute difference', () => {
            expect(
                TimestampConverter.formatMaturity(
                    FUTURE_TIMESTAMP,
                    'minutes',
                    CURRENT_TIME
                )
            ).toBeCloseTo(1440, 0);
        });
    });

    describe('calculateTimeDifference', () => {
        it('should calculate time difference in milliseconds', () => {
            const pastTimestamp =
                TimestampConverter.getCurrentTimestamp() - 3600;
            const result =
                TimestampConverter.calculateTimeDifference(pastTimestamp);
            expect(result).toBeCloseTo(3600000, -3);
        });
    });

    describe('getCurrentTimestamp', () => {
        it('should return frozen current Unix timestamp', () => {
            const result = TimestampConverter.getCurrentTimestamp();
            expect(result).toBe(1672531200);
        });
    });

    describe('calculateIntervalTimestamp', () => {
        it('should calculate the next interval timestamp', () => {
            expect(TimestampConverter.calculateIntervalTimestamp(105, 10)).toBe(
                110
            );
            expect(
                TimestampConverter.calculateIntervalTimestamp(200, '15')
            ).toBe(210);
        });
    });
});
