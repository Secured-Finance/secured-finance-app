import { OrderSide } from '@secured-finance/sf-client';

export const getAmountValidation = (
    value: bigint,
    availableBalance: bigint,
    orderSide: OrderSide
): boolean => {
    return value > availableBalance && orderSide === OrderSide.LEND;
};
