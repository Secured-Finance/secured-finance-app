import { ColorFormat } from 'src/types';
import { OrderSide } from '@secured-finance/sf-client';
import { OrderTypeConverter } from './orderTypeConverter';

type RowLike = { side?: number; amount?: bigint; futureValue?: bigint };

export function getOrderColor(row: RowLike): ColorFormat['color'] | undefined {
    if (row.side !== undefined) {
        return OrderTypeConverter.from(row.side) === OrderSide.BORROW
            ? 'negative'
            : 'positive';
    }
    if (row.amount !== undefined) {
        return row.amount < 0 ? 'negative' : 'positive';
    }
    if (row.futureValue !== undefined) {
        return row.futureValue < 0 ? 'negative' : 'positive';
    }
    return undefined;
}
