import timemachine from 'timemachine';
import { isPastDate } from './date';

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
