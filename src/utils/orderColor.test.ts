import { getOrderColor } from './orderColor';

describe('Converters', () => {
    it('getOrderColor() resolves side, amount, and futureValue', () => {
        expect(getOrderColor({ side: 1 })).toBe('negative'); // BORROW
        expect(getOrderColor({ side: 0 })).toBe('positive'); // LEND
        expect(getOrderColor({ amount: 100n })).toBe('positive');
        expect(getOrderColor({ amount: -50n })).toBe('negative');
        expect(getOrderColor({ futureValue: 200n })).toBe('positive');
        expect(getOrderColor({ futureValue: -200n })).toBe('negative');
        expect(getOrderColor({})).toBeUndefined();
    });
});
