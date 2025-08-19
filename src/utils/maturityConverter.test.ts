import { MaturityConverter } from './maturityConverter';

describe('MaturityConverter', () => {
    const DEC_2022_TIMESTAMP = 1669852800; // Dec 1, 2022 00:00:00 UTC

    describe('getUTCMonthYear', () => {
        it('should return 2-digit year when numeric is false/undefined', () => {
            expect(MaturityConverter.getUTCMonthYear(DEC_2022_TIMESTAMP)).toBe(
                'DEC22'
            );
            expect(
                MaturityConverter.getUTCMonthYear(DEC_2022_TIMESTAMP, false)
            ).toBe('DEC22');
        });

        it('should return 4-digit year when numeric is true', () => {
            expect(
                MaturityConverter.getUTCMonthYear(DEC_2022_TIMESTAMP, true)
            ).toBe('DEC2022');
        });
    });

    describe('formatDate', () => {
        it('should format date correctly', () => {
            expect(MaturityConverter.formatDate(DEC_2022_TIMESTAMP)).toBe(
                'Dec 1, 2022'
            );
        });
    });
});
