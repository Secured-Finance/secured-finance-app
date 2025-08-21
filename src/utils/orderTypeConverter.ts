import { OrderSide } from '@secured-finance/sf-client';

export class OrderTypeConverter {
    static from(value: number | string): OrderSide {
        return value === 1 || value === '1' ? OrderSide.BORROW : OrderSide.LEND;
    }

    static toNumber(side: OrderSide): number {
        return side === OrderSide.BORROW ? 1 : 0;
    }

    static toDisplayString(side: OrderSide): string {
        return side === OrderSide.BORROW ? 'Borrow' : 'Lend';
    }
}
