import { OrderSide } from '@secured-finance/sf-client';
import { BigNumber } from 'ethers';
import { AssetPriceMap } from 'src/store/assetPrices/selectors';
import { TradeHistory } from 'src/types';
import { currencyMap, hexToCurrencySymbol } from './currencyList';
import { LoanValue } from './entities';
import { Rate } from './rate';
import { OrderList } from 'src/hooks';

export const computeWeightedAverageRate = (trades: TradeHistory) => {
    if (!trades.length) {
        return new Rate(0);
    }

    const totalAmount = trades.reduce((acc, trade) => acc + trade.amount, 0);
    const total = trades.reduce(
        (acc, trade) =>
            acc +
            LoanValue.fromPrice(
                trade.averagePrice,
                trade.maturity
            ).apr.toNumber() *
                trade.amount,
        0
    );
    return new Rate(total / totalAmount);
};

export const computeNetValue = (
    trades: TradeHistory,
    priceList: AssetPriceMap
) => {
    return trades.reduce((acc, { amount, currency, side }) => {
        const ccy = hexToCurrencySymbol(currency);
        if (!ccy) return acc;
        return (
            acc +
            currencyMap[ccy].fromBaseUnit(BigNumber.from(amount)) *
                priceList[ccy] *
                (side.toString() === OrderSide.LEND ? 1 : -1)
        );
    }, 0);
};

export type TradeSummary = {
    currency: string;
    maturity: string;
    amount: BigNumber;
    forwardValue: BigNumber;
    averagePrice: BigNumber;
};

export const calculateForwardValue = (
    amount: BigNumber,
    unitPrice: BigNumber
): BigNumber => {
    return amount.mul(10000).div(unitPrice);
};

export const calculateAveragePrice = (unitPrice: BigNumber): number => {
    return Number(unitPrice) / 10000;
};

export const formatOrders = (orders: OrderList): TradeHistory => {
    return orders?.map(order => ({
        amount: order.amount,
        side: order.side,
        orderPrice: order.unitPrice,
        createdAt: order.timestamp,
        currency: order.currency,
        maturity: order.maturity,
        forwardValue: calculateForwardValue(order.amount, order.unitPrice),
        averagePrice: calculateAveragePrice(order.unitPrice),
    }));
};
