import timemachine from 'timemachine';
import {
    calculateTimeDifference,
    countdown,
    getTimestampRelativeToNow,
    isPastDate,
    isRedemptionPeriod,
    isRepaymentPeriod,
} from './date';

beforeAll(() => {
    timemachine.reset();
    timemachine.config({
        dateString: '2022-12-15T00:00:00.00Z',
    });
});

const currentTimestamp = 1671062400;

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

describe('getTimeStampRelativeToNow function', () => {
    it('should return a future timestamp for if isFuture is true', () => {
        const hours = 3;
        const result = getTimestampRelativeToNow(hours, true);
        const expectedTimestamp = Math.floor(
            currentTimestamp + hours * 60 * 60
        );
        expect(result).toBe(expectedTimestamp);
    });

    it('should return a past timestamp if isFuture is false', () => {
        const hours = 2;
        const isFuture = false;
        const result = getTimestampRelativeToNow(hours, isFuture);
        const expectedTimestamp = Math.floor(
            currentTimestamp - hours * 60 * 60
        );
        expect(result).toBe(expectedTimestamp);
    });
});

describe('calculateTimeDifference', () => {
    it('calculates time difference correctly', () => {
        const timestamp = Math.floor(currentTimestamp - 2 * 60 * 60);
        const timeDifference = calculateTimeDifference(timestamp);
        expect(timeDifference).toBeCloseTo(2 * 60 * 60 * 1000, -2);
    });
});

describe('isRepaymentPeriod', () => {
    it('returns true for repayment period within a week', () => {
        const timestamp = getTimestampRelativeToNow(144, true); //6 days in future
        const result = isRepaymentPeriod(timestamp);
        expect(result).toBe(true);
        const pastTimestamp = getTimestampRelativeToNow(144); // 6 days in past
        expect(isRepaymentPeriod(pastTimestamp)).toBe(true);
    });

    it('returns false for repayment period beyond a week', () => {
        const maturity = getTimestampRelativeToNow(240);
        const result = isRepaymentPeriod(maturity);
        expect(result).toBe(false);
    });

    it('returns false for repayment period till a week before', () => {
        const maturity = getTimestampRelativeToNow(240, true);
        const result = isRepaymentPeriod(maturity);
        expect(result).toBe(false);
    });
});

describe('isRedemptionPeriod', () => {
    it('returns true for redemption period beyond a week', () => {
        const maturity = getTimestampRelativeToNow(240);
        const result = isRedemptionPeriod(maturity);
        expect(result).toBe(true);
    });

    it('returns false for redemption period within a week after maturity', () => {
        const maturity = getTimestampRelativeToNow(144);
        const result = isRedemptionPeriod(maturity);

        expect(result).toBe(false);
    });

    it('returns false for redemption period before maturity', () => {
        const maturity = getTimestampRelativeToNow(22, true);
        const result = isRedemptionPeriod(maturity);

        expect(result).toBe(false);
    });
});
