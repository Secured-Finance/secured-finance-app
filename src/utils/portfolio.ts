import { BigNumber } from 'ethers';
import { AssetPriceMap } from 'src/store/assetPrices/selectors';
import { TradeHistory } from 'src/types';
import { currencyMap, hexToCurrencySymbol } from './currencyList';
import { LoanValue } from './entities';
import { Rate } from './rate';
import { OrderList, Position } from 'src/hooks';
import { Order } from 'src/types';

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
    positions: Position[],
    priceList: AssetPriceMap
) => {
    return positions.reduce((acc, { amount, currency }) => {
        const ccy = hexToCurrencySymbol(currency);
        if (!ccy) return acc;
        return acc + currencyMap[ccy].fromBaseUnit(amount) * priceList[ccy];
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
        createdAt: order.createdAt,
        currency: order.currency,
        maturity: order.maturity,
        forwardValue: calculateForwardValue(order.amount, order.unitPrice),
        averagePrice: calculateAveragePrice(order.unitPrice),
    }));
};

export const checkOrderIsFilled = (
    order: Order,
    orders: OrderList
): boolean => {
    for (let i = 0; i < orders.length; i++) {
        if (checkOrdersAreSame(order, orders[i])) {
            return true;
        }
    }
    return false;
};

export const checkOrdersAreSame = (order1: Order, order2: OrderList[0]) => {
    return (
        BigNumber.from(order1.orderId).toString() ===
            order2.orderId.toString() &&
        order1.currency === order2.currency &&
        order1.maturity.toString() === order2.maturity
    );
};

export const sortOrders = (a: Order, b: Order) => {
    return Number(b.createdAt.sub(a.createdAt));
};
