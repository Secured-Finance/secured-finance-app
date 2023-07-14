import { OrderSide } from '@secured-finance/sf-client';

export const getAmountValidation = (
    value: number,
    availableBalance: number,
    orderSide: OrderSide
): boolean => {
    return value > availableBalance && orderSide === OrderSide.LEND;
};
