import { OrderSide } from '@secured-finance/sf-client';
import { getOrderColor } from './orderColor';

describe('Converters', () => {
    it('getOrderColor() resolves side, amount, and futureValue', () => {
        expect(getOrderColor({ side: OrderSide.BORROW })).toBe('negative');
        expect(getOrderColor({ side: OrderSide.LEND })).toBe('positive');
        expect(getOrderColor({ amount: 100n })).toBe('positive');
        expect(getOrderColor({ amount: -50n })).toBe('negative');
        expect(getOrderColor({ futureValue: 200n })).toBe('positive');
        expect(getOrderColor({ futureValue: -200n })).toBe('negative');
        expect(getOrderColor({})).toBeUndefined();
    });
});
