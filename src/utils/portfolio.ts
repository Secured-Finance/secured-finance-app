import { OrderSide } from '@secured-finance/sf-client';
import { BigNumber } from 'ethers';
import { AssetPriceMap } from 'src/store/assetPrices/selectors';
import { TradeHistory } from 'src/types';
import { hexToString } from 'web3-utils';
import { currencyMap, CurrencySymbol } from './currencyList';
import { LoanValue, Maturity } from './entities';
import { Rate } from './rate';

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
            ).apy.toNumber() *
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
        const ccy = hexToString(currency) as CurrencySymbol;
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
    maturity: Maturity;
    amount: BigNumber;
    forwardValue: BigNumber;
    averagePrice: BigNumber;
};

export const aggregateTrades = (trades: TradeHistory): TradeSummary[] => {
    const tradeMap: Map<string, TradeSummary> = new Map();

    for (const trade of trades) {
        const key = trade.currency + trade.maturity.toString();
        let summary = tradeMap.get(key);
        if (!summary) {
            summary = {
                currency: trade.currency,
                maturity: new Maturity(trade.maturity),
                amount: BigNumber.from(0),
                forwardValue: BigNumber.from(0),
                averagePrice: BigNumber.from(0),
            };
            tradeMap.set(key, summary);
        }

        // 1 = borrow, 0 = lend
        summary.amount = summary.amount.add(
            BigNumber.from(trade.amount).mul(trade.side === 1 ? -1 : 1)
        );
        summary.averagePrice = summary.averagePrice.add(
            BigNumber.from(trade.orderPrice)
                .mul(trade.side === 1 ? -1 : 1)
                .mul(trade.amount)
        );
        summary.forwardValue = summary.forwardValue.add(
            BigNumber.from(trade.forwardValue).mul(trade.side === 1 ? -1 : 1)
        );
    }

    return Array.from(tradeMap.values()).map(summary => ({
        ...summary,
        forwardValue: BigNumber.from(summary.forwardValue),
        averagePrice: summary.averagePrice.div(summary.amount),
    }));
};
