import { OrderSide } from '@secured-finance/sf-client';
import { BigNumber } from 'ethers';
import { AssetPriceMap } from 'src/store/assetPrices/selectors';
import { TradeHistory } from 'src/types';
import { hexToString } from 'web3-utils';
import { currencyMap, CurrencySymbol } from './currencyList';
import { LoanValue } from './entities';
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
