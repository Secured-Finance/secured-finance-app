import { ethers } from 'ethers';
import { TradeHistory } from 'src/hooks';
import { AssetPriceMap } from 'src/store/assetPrices/selectors';
import { CurrencySymbol } from './currencyList';
import {
    computeNetValue,
    computeWeightedAverageRate,
    convertTradeHistoryToTableData,
} from './portfolio';

describe('computeWeightedAverage', () => {
    it('should return the weighted average', () => {
        const trades = [
            {
                amount: 1000,
                rate: 1,
            },
            {
                amount: 9000,
                rate: 2,
            },
        ];
        expect(
            computeWeightedAverageRate(
                trades as unknown as TradeHistory
            ).toNumber()
        ).toEqual(1.9);
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
                currency: ethers.utils.formatBytes32String(CurrencySymbol.ETH),
            },
            {
                amount: '100000000000000000000',
                currency: ethers.utils.formatBytes32String(CurrencySymbol.FIL),
            },
        ];
        expect(
            computeNetValue(trades as unknown as TradeHistory, priceMap)
        ).toEqual(1600);
    });

    it('should return 0 if no trades are provided', () => {
        expect(computeNetValue([], priceMap)).toEqual(0);
    });
});

describe('convertTradeHistoryToTableData', () => {
    it('should return the correct data', () => {
        const trade = {
            side: 1,
            amount: 1000,
            rate: 1000,
            currency:
                '0x5553444300000000000000000000000000000000000000000000000000000000',
            maturity: 1669852800,
        };
        expect(convertTradeHistoryToTableData(trade).contract).toEqual(
            'USDC-DEC22'
        );
    });
});
