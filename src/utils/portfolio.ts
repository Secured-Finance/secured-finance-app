import { TradeHistory } from 'src/hooks';

export const computeWeightedAverage = (trades: TradeHistory) => {
    if (!trades.length) {
        return 0;
    }

    const totalAmount = trades.reduce((acc, trade) => acc + trade.amount, 0);
    const total = trades.reduce(
        (acc, trade) => acc + trade.rate * trade.amount,
        0
    );
    return total / totalAmount;
};

export const computeNetValue = (trades: TradeHistory) => {
    if (!trades.length) {
        return 0;
    }

    return trades.reduce((acc, trade) => acc + trade.amount, 0);
};
