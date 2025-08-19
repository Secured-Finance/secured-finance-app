import { OrderSide } from '@secured-finance/sf-client';

export class OrderTypeConverter {
    static fromNumber(value: number): OrderSide {
        return value === 1 ? OrderSide.BORROW : OrderSide.LEND;
    }

    static fromString(value: string): OrderSide {
        return value === '1' ? OrderSide.BORROW : OrderSide.LEND;
    }

    static toNumber(side: OrderSide): number {
        return side === OrderSide.BORROW ? 1 : 0;
    }

    static toString(side: OrderSide): string {
        return side === OrderSide.BORROW ? 'Borrow' : 'Lend';
    }

    static toDisplayString(side: OrderSide): string {
        return side === OrderSide.BORROW ? 'Borrow' : 'Lend';
    }
}
