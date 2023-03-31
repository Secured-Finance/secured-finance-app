import { BigNumber } from 'ethers';
import { formatBytes32String } from 'ethers/lib/utils';
import { AssetPriceMap } from 'src/store/assetPrices/selectors';
import { aggregatedTrades, transactions } from 'src/stories/mocks/fixtures';
import { TradeHistory } from 'src/types';
import timemachine from 'timemachine';
import { CurrencySymbol } from './currencyList';
import {
    aggregateTrades,
    computeNetValue,
    computeWeightedAverageRate,
} from './portfolio';

beforeAll(() => {
    timemachine.reset();
    timemachine.config({
        dateString: '2022-12-01T11:00:00.00Z',
    });
});

describe('computeWeightedAverage', () => {
    it('should return the weighted average', () => {
        jest.spyOn(global.Date, 'now').mockImplementationOnce(() =>
            new Date('2022-12-01T11:00:00.00Z').valueOf()
        );
        const trades = [
            {
                amount: 1000,
                averagePrice: BigNumber.from(9698),
                maturity: BigNumber.from(1675252800),
            },
            {
                amount: 9000,
                averagePrice: BigNumber.from(9674),
                maturity: BigNumber.from(1675252800),
            },
        ];
        expect(
            computeWeightedAverageRate(
                trades as unknown as TradeHistory
            ).toNumber()
        ).toEqual(196880);
    });

    it('should return 0 if no trades are provided', () => {
        expect(computeWeightedAverageRate([]).toNumber()).toEqual(0);
    });
});

describe('computeNetValue', () => {
    const priceMap: AssetPriceMap = {
        [CurrencySymbol.ETH]: 1000,
        [CurrencySymbol.FIL]: 6,
        [CurrencySymbol.USDC]: 1,
        [CurrencySymbol.BTC]: 30000,
    };
    it('should return the net value', () => {
        const trades = [
            {
                amount: '1000000000000000000',
                currency: formatBytes32String(CurrencySymbol.ETH),
                side: 0,
            },
            {
                amount: '100000000000000000000',
                currency: formatBytes32String(CurrencySymbol.FIL),
                side: 1,
            },
        ];
        expect(
            computeNetValue(trades as unknown as TradeHistory, priceMap)
        ).toEqual(400);
    });

    it('should return 0 if no trades are provided', () => {
        expect(computeNetValue([], priceMap)).toEqual(0);
    });
});

describe('aggregateTrades', () => {
    it('should aggregate trades', () => {
        // Forward value is ignored in the comparison because I am not sure yet what we are getting for the Graph
        expect(
            aggregateTrades(transactions).map(
                ({ amount, forwardValue, currency, maturity }) => ({
                    amount,
                    forwardValue,
                    currency,
                    maturity,
                })
            )
        ).toEqual(
            aggregatedTrades.map(
                ({ amount, forwardValue, currency, maturity }) => ({
                    amount,
                    forwardValue,
                    currency,
                    maturity,
                })
            )
        );
    });

    it('should return an empty array if no trades are provided', () => {
        expect(aggregateTrades([])).toEqual([]);
    });
});
