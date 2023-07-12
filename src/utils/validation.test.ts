import { OrderSide } from '@secured-finance/sf-client';
import { getAmountValidation } from './validation';

describe('getAmountValidation', () => {
    it('should return false for borrow orders', () => {
        expect(getAmountValidation(100, 1000, OrderSide.BORROW)).toEqual(false);
    });

    it('should return true if available amount is less than value', () => {
        expect(getAmountValidation(10000, 1000, OrderSide.LEND)).toEqual(true);
    });

    it('should return false if available amount is more than value', () => {
        expect(getAmountValidation(100, 1000, OrderSide.LEND)).toEqual(false);
    });
});
