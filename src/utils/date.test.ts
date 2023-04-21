import timemachine from 'timemachine';
import { countdown, isPastDate } from './date';

beforeAll(() => {
    timemachine.reset();
    timemachine.config({
        dateString: '2022-12-15T00:00:00.00Z',
    });
});

describe('isPastDate', () => {
    it('should returns true for a past date', () => {
        const pastTimestamp = 1647494400; // March 15, 2022 UTC
        const result = isPastDate(pastTimestamp);
        expect(result).toBe(true);
    });

    it('should returns false for a future date', () => {
        const futureTimestamp = 1747494400; // January 15, 2025 UTC
        const result = isPastDate(futureTimestamp);
        expect(result).toBe(false);
    });

    it('should returns true for a current date', () => {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const result = isPastDate(currentTimestamp);
        expect(result).toBe(true);
    });
});

describe('countdown', () => {
    it('returns the correct countdown string when there are hours, minutes, and seconds remaining', () => {
        const targetTimestamp = Date.UTC(2023, 4, 1, 12, 0, 0, 0); // May 1, 2023 at 12:00:00 UTC
        const now = Date.UTC(2023, 4, 1, 6, 30, 0, 0); // May 1, 2023 at 06:30:00 UTC
        const expectedCountdown = '0d 5h 30m 0s';

        jest.spyOn(Date, 'now').mockReturnValue(now);
        const countdownString = countdown(targetTimestamp);

        expect(countdownString).toEqual(expectedCountdown);
    });

    it('returns the correct countdown string when there are minutes and seconds remaining', () => {
        const targetTimestamp = Date.UTC(2023, 4, 1, 12, 0, 0, 0); // May 1, 2023 at 12:00:00 UTC
        const now = Date.UTC(2023, 4, 1, 11, 59, 0, 0); // May 1, 2023 at 11:59:00 UTC
        const expectedCountdown = '0d 0h 1m 0s';

        jest.spyOn(Date, 'now').mockReturnValue(now);
        const countdownString = countdown(targetTimestamp);

        expect(countdownString).toEqual(expectedCountdown);
    });

    it('returns the correct countdown string when there are seconds remaining', () => {
        const targetTimestamp = Date.UTC(2023, 4, 1, 12, 0, 0, 0); // May 1, 2023 at 12:00:00 UTC
        const now = Date.UTC(2023, 4, 1, 11, 59, 59, 0); // May 1, 2023 at 11:59:59 UTC
        const expectedCountdown = '0d 0h 0m 1s';

        jest.spyOn(Date, 'now').mockReturnValue(now);
        const countdownString = countdown(targetTimestamp);

        expect(countdownString).toEqual(expectedCountdown);
    });

    it('returns "" when the target timestamp has passed', () => {
        const targetTimestamp = Date.UTC(2023, 4, 1, 12, 0, 0, 0); // May 1, 2023 at 12:00:00 UTC
        const now = Date.UTC(2023, 4, 2, 12, 0, 0, 0); // May 2, 2023 at 12:00:00 UTC
        const expectedCountdown = '';

        jest.spyOn(Date, 'now').mockReturnValue(now);
        const countdownString = countdown(targetTimestamp);

        expect(countdownString).toEqual(expectedCountdown);
    });
});
