import { BigNumber } from 'ethers';
import { formatBytes32String } from 'ethers/lib/utils';
import { AssetPriceMap } from 'src/store/assetPrices/selectors';
import { TradeHistory } from 'src/types';
import timemachine from 'timemachine';
import { CurrencySymbol } from './currencyList';
import { computeNetValue, computeWeightedAverageRate } from './portfolio';

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
        [CurrencySymbol.EFIL]: 6,
        [CurrencySymbol.USDC]: 1,
        [CurrencySymbol.WBTC]: 30000,
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
                currency: formatBytes32String(CurrencySymbol.EFIL),
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

    it('should return the net value of borrow and lend trades', () => {
        const trades = [
            {
                amount: '10000000000000000000',
                currency: formatBytes32String(CurrencySymbol.ETH),
                side: 1,
            },
            {
                amount: '1000000000000000000000',
                currency: formatBytes32String(CurrencySymbol.EFIL),
                side: 1,
            },
            {
                amount: '100000000',
                currency: formatBytes32String(CurrencySymbol.WBTC),
                side: 0,
            },
            {
                amount: '1000000000',
                currency: formatBytes32String(CurrencySymbol.USDC),
                side: 1,
            },
        ];
        expect(
            computeNetValue(
                trades.filter(
                    trade => trade.side === 1
                ) as unknown as TradeHistory,
                priceMap
            )
        ).toEqual(-17000);

        expect(
            computeNetValue(
                trades.filter(
                    trade => trade.side === 0
                ) as unknown as TradeHistory,
                priceMap
            )
        ).toEqual(30000);
    });
});
