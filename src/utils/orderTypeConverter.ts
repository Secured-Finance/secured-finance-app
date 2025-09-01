import { OrderSide } from '@secured-finance/sf-client';
export class OrderTypeConverter {
    static from(value: number | string | null | undefined): OrderSide {
        if (value === null || value === undefined) {
            return OrderSide.LEND; // Default to LEND
        }
        const normalizedValue = Number(value);
        if (normalizedValue === 1) {
            return OrderSide.BORROW;
        }

        // Default to LEND for any other case (0, '0', empty string, or invalid values)
        return OrderSide.LEND;
    }

    static toDisplayString(side: OrderSide): string {
        if (side === OrderSide.BORROW) {
            return 'Borrow';
        }

        // Default to 'Lend' for any other case (including null/undefined)
        return 'Lend';
    }
}
