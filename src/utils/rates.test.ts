import { Rate } from './rate';

describe('Rate class', () => {
    it('should return the correct rate', () => {
        const rate = new Rate(123);
        expect(rate.toNumber()).toBe(123);
    });

    it('should return the correct rate as a percent', () => {
        const rate = new Rate(10000);
        expect(rate.toPercent()).toBe('1%');
    });
});
