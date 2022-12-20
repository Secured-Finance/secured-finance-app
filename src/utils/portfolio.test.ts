import { BigNumber } from 'ethers';
import { formatBytes32String } from 'ethers/lib/utils';
import mockDate from 'mockdate';
import { AssetPriceMap } from 'src/store/assetPrices/selectors';
import { TradeHistory } from 'src/types';
import { CurrencySymbol } from './currencyList';
import {
    computeNetValue,
    computeWeightedAverageRate,
    convertTradeHistoryToTableData,
} from './portfolio';

beforeAll(() => {
    mockDate.reset();
    mockDate.set(new Date('2022-12-01T11:00:00.00Z'));
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
        ).toEqual(38832);
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

describe('convertTradeHistoryToTableData', () => {
    it('should return the correct data', () => {
        const trade: TradeHistory[number] = {
            id: '0x123',
            amount: 1000,
            averagePrice: BigNumber.from(9698),
            side: 1,
            orderPrice: 100000,
            createdAt: 123,
            blockNumber: 123,
            taker: '0x123',
            forwardValue: 100000,
            txHash: '0x123',
            currency:
                '0x5553444300000000000000000000000000000000000000000000000000000000',
            maturity: BigNumber.from(1675252800),
        };
        expect(convertTradeHistoryToTableData(trade).contract).toEqual(
            'USDC-FEB23'
        );
    });
});
