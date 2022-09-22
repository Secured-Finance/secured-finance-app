import * as dayjs from 'dayjs';
import { BigNumber } from 'ethers';
import { ActiveTrade } from 'src/components/organisms';
import { OrderSide, TradeHistory } from 'src/hooks';
import { AssetPriceMap } from 'src/store/assetPrices/selectors';
import Web3 from 'web3';
import { currencyMap, CurrencySymbol } from './currencyList';
import { Rate } from './rate';

export const computeWeightedAverageRate = (trades: TradeHistory) => {
    if (!trades.length) {
        return new Rate(0);
    }

    const totalAmount = trades.reduce((acc, trade) => acc + trade.amount, 0);
    const total = trades.reduce(
        (acc, trade) => acc + trade.rate * trade.amount,
        0
    );
    return new Rate(total / totalAmount);
};

export const computeNetValue = (
    trades: TradeHistory,
    priceList: AssetPriceMap
) => {
    if (!trades.length) {
        return 0;
    }

    return trades.reduce((acc, { amount, currency }) => {
        const ccy = Web3.utils.hexToString(currency) as CurrencySymbol;
        return (
            acc +
            currencyMap[ccy].fromBaseUnit(BigNumber.from(amount)) *
                priceList[ccy]
        );
    }, 0);
};

export const convertTradeHistoryToTableData = (
    trade: TradeHistory[number]
): ActiveTrade => {
    const { side, amount, rate, currency, maturity } = trade;
    const ccy = Web3.utils.hexToString(currency) as CurrencySymbol;
    const apy = new Rate(rate);

    // TODO: add this function in the SDK
    const contract = `${ccy}-${dayjs
        .unix(maturity)
        .format('MMMYY')
        .toUpperCase()}`;

    const dayToMaturity = dayjs.unix(maturity).diff(Date.now(), 'day');
    const notional = BigNumber.from(amount);
    const position = side.toString() === OrderSide.Lend ? 'Lend' : 'Borrow';

    return {
        position,
        contract,
        apy,
        notional,
        currency: ccy,
        presentValue: notional,
        dayToMaturity,
        forwardValue: notional,
    };
};
