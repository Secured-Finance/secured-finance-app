import { calculateBarWidth } from './barWidth';

describe('calculateBarWidth', () => {
    it('should calculate bar width correctly', () => {
        expect(calculateBarWidth(50, 100, 200, 10)).toBe(100);
        expect(calculateBarWidth(25, 100, 300, 20)).toBe(75);
    });

    it('should respect minimum width', () => {
        expect(calculateBarWidth(1, 1000, 300, 50)).toBe(50);
    });

    it('should respect maximum width', () => {
        expect(calculateBarWidth(100, 100, 200, 10)).toBe(200);
    });

    it('should handle zero total', () => {
        expect(calculateBarWidth(50, 0, 200, 10)).toBe(10);
    });
});
