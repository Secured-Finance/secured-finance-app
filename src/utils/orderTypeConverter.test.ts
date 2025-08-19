import { OrderSide } from '@secured-finance/sf-client';
import { OrderTypeConverter } from './orderTypeConverter';

describe('OrderTypeConverter', () => {
    describe('fromNumber', () => {
        it('should convert 0 to LEND', () => {
            expect(OrderTypeConverter.fromNumber(0)).toBe(OrderSide.LEND);
        });

        it('should convert 1 to BORROW', () => {
            expect(OrderTypeConverter.fromNumber(1)).toBe(OrderSide.BORROW);
        });

        it('should convert any non-1 number to LEND', () => {
            expect(OrderTypeConverter.fromNumber(2)).toBe(OrderSide.LEND);
            expect(OrderTypeConverter.fromNumber(-1)).toBe(OrderSide.LEND);
        });
    });

    describe('fromString', () => {
        it('should convert "0" to LEND', () => {
            expect(OrderTypeConverter.fromString('0')).toBe(OrderSide.LEND);
        });

        it('should convert "1" to BORROW', () => {
            expect(OrderTypeConverter.fromString('1')).toBe(OrderSide.BORROW);
        });

        it('should convert any non-"1" string to LEND', () => {
            expect(OrderTypeConverter.fromString('2')).toBe(OrderSide.LEND);
            expect(OrderTypeConverter.fromString('abc')).toBe(OrderSide.LEND);
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

    describe('toString', () => {
        it('should convert BORROW to "Borrow"', () => {
            expect(OrderTypeConverter.toString(OrderSide.BORROW)).toBe(
                'Borrow'
            );
        });

        it('should convert LEND to "Lend"', () => {
            expect(OrderTypeConverter.toString(OrderSide.LEND)).toBe('Lend');
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
