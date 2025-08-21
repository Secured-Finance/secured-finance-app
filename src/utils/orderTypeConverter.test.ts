import { OrderSide } from '@secured-finance/sf-client';
import { OrderTypeConverter } from './orderTypeConverter';

describe('OrderTypeConverter', () => {
    describe('from', () => {
        it('should convert 0 to LEND', () => {
            expect(OrderTypeConverter.from(0)).toBe(OrderSide.LEND);
        });

        it('should convert 1 to BORROW', () => {
            expect(OrderTypeConverter.from(1)).toBe(OrderSide.BORROW);
        });

        it('should convert "0" to LEND', () => {
            expect(OrderTypeConverter.from('0')).toBe(OrderSide.LEND);
        });

        it('should convert "1" to BORROW', () => {
            expect(OrderTypeConverter.from('1')).toBe(OrderSide.BORROW);
        });
    });

    describe('toNumber', () => {
        it('should convert BORROW to 1', () => {
            expect(OrderTypeConverter.toNumber(OrderSide.BORROW)).toBe(1);
        });

        it('should convert LEND to 0', () => {
            expect(OrderTypeConverter.toNumber(OrderSide.LEND)).toBe(0);
        });
    });

    describe('toDisplayString', () => {
        it('should convert BORROW to "Borrow"', () => {
            expect(OrderTypeConverter.toDisplayString(OrderSide.BORROW)).toBe(
                'Borrow'
            );
        });

        it('should convert LEND to "Lend"', () => {
            expect(OrderTypeConverter.toDisplayString(OrderSide.LEND)).toBe(
                'Lend'
            );
        });
    });
});
