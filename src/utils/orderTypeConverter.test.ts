import { OrderSide } from '@secured-finance/sf-client';
import { OrderTypeConverter } from './orderTypeConverter';

describe('OrderTypeConverter', () => {
    describe('from', () => {
        it('should convert valid values', () => {
            expect(OrderTypeConverter.from(0)).toBe(OrderSide.LEND);
            expect(OrderTypeConverter.from(1)).toBe(OrderSide.BORROW);
            expect(OrderTypeConverter.from('0')).toBe(OrderSide.LEND);
            expect(OrderTypeConverter.from('1')).toBe(OrderSide.BORROW);
        });

        it('should handle string trimming', () => {
            expect(OrderTypeConverter.from('  1  ')).toBe(OrderSide.BORROW);
            expect(OrderTypeConverter.from('  0  ')).toBe(OrderSide.LEND);
        });

        it('should default to LEND for invalid values', () => {
            expect(OrderTypeConverter.from(null)).toBe(OrderSide.LEND);
            expect(OrderTypeConverter.from(undefined)).toBe(OrderSide.LEND);
            expect(OrderTypeConverter.from('')).toBe(OrderSide.LEND);
            expect(OrderTypeConverter.from('   ')).toBe(OrderSide.LEND);
            expect(OrderTypeConverter.from(2)).toBe(OrderSide.LEND);
            expect(OrderTypeConverter.from('invalid')).toBe(OrderSide.LEND);
        });
    });

    describe('toDisplayString', () => {
        it('should convert OrderSide to display string', () => {
            expect(OrderTypeConverter.toDisplayString(OrderSide.BORROW)).toBe(
                'Borrow'
            );
            expect(OrderTypeConverter.toDisplayString(OrderSide.LEND)).toBe(
                'Lend'
            );
        });
    });
});
