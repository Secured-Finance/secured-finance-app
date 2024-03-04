import { OrderList, Position } from 'src/hooks';
import {
    AssetPriceMap,
    Order,
    Transaction,
    TransactionHistoryList,
} from 'src/types';
import { ZERO_BI } from './collateral';
import { currencyMap, hexToCurrencySymbol } from './currencyList';
import { LoanValue } from './entities';
import { Rate } from './rate';

export const computeWeightedAverageRate = (trades: TransactionHistoryList) => {
    if (!trades.length) {
        return new Rate(0);
    }

    const totalAmount = trades.reduce(
        (acc: number, trade: Transaction) => acc + trade.amount,
        0
    );
    const total = trades.reduce(
        (acc: number, trade: Transaction) =>
            acc +
            LoanValue.fromPrice(
                Number(trade.averagePrice),
                Number(trade.maturity)
            ).apr.toNumber() *
                trade.amount,
        0
    );
    return new Rate(total / totalAmount);
};

export const computeNetValue = (
    positions: Pick<Position, 'amount' | 'currency'>[],
    priceList: AssetPriceMap
) => {
    return positions.reduce((acc, { amount, currency }) => {
        const ccy = hexToCurrencySymbol(currency);
        if (!ccy) return acc;
        return (
            acc +
            currencyMap[ccy].fromBaseUnit(amount) * (priceList?.[ccy] ?? 0)
        );
    }, 0);
};

export type TradeSummary = {
    currency: string;
    maturity: string;
    amount: bigint;
    futureValue: bigint;
    averagePrice: bigint;
};

export const calculateFutureValue = (
    amount: bigint,
    unitPrice: bigint
): bigint => {
    return (amount * BigInt(10000)) / unitPrice;
};

export const calculateAveragePrice = (unitPrice: bigint): number => {
    return Number(unitPrice) / 10000;
};

export const formatOrders = (orders: OrderList): TransactionHistoryList => {
    return orders?.map(order => ({
        amount: order.amount,
        side: order.side,
        executionPrice: order.unitPrice,
        createdAt: order.createdAt,
        currency: order.currency,
        maturity: order.maturity,
        futureValue: calculateFutureValue(order.amount, order.unitPrice),
        averagePrice: calculateAveragePrice(order.unitPrice),
        feeInFV: ZERO_BI,
        user: {
            id: order.user ?? '',
        },
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
        BigInt(order1.orderId) === BigInt(order2.orderId) &&
        order1.currency === order2.currency &&
        order1.maturity.toString() === order2.maturity
    );
};

export const sortOrders = (a: Order, b: Order) => {
    return Number(b.createdAt - a.createdAt);
};

export const getMaxAmount = (orders: { amount: bigint }[]) => {
    if (!orders.length) {
        return ZERO_BI;
    }
    return orders.reduce(
        (prev, current) => (prev > current.amount ? prev : current.amount),
        orders[0].amount
    );
};

export const getMappedOrderStatus = (order: Order): string => {
    switch (order.status) {
        case 'Open':
            if (!order.lendingMarket.isActive) {
                return 'Expired';
            }
            break;
        case 'PartiallyFilled':
            if (!order.lendingMarket.isActive) {
                return 'Partially Filled & Expired';
            } else {
                return 'Partially Filled';
            }
        case 'Killed':
            if (order.isCircuitBreakerTriggered) {
                if (Number(order.filledAmount) === 0) {
                    return 'Blocked';
                } else {
                    return 'Partially Filled & Blocked';
                }
            } else if (Number(order.filledAmount) !== 0) {
                return 'Partially Filled & Killed';
            }
            break;
        case 'Cancelled':
            if (Number(order.filledAmount) !== 0) {
                return 'Partially Filled & Cancelled';
            }
            break;
    }
    return order.status;
};
