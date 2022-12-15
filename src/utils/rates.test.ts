import { Rate } from './rate';

describe('Rate class', () => {
    it('should return the correct rate', () => {
        const rate = new Rate(123);
        expect(rate.toNumber()).toBe(123);
    });
});
