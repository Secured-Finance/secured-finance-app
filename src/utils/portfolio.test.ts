import { TradeHistory } from 'src/hooks';
import {
    computeNetValue,
    computeWeightedAverage,
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
            computeWeightedAverage(trades as unknown as TradeHistory)
        ).toEqual(1.9);
    });

    it('should return 0 if no trades are provided', () => {
        expect(computeWeightedAverage([])).toEqual(0);
    });
});

describe('computeNetValue', () => {
    it('should return the net value', () => {
        const trades = [
            {
                amount: 1000,
            },
            {
                amount: 9000,
            },
        ];
        expect(computeNetValue(trades as unknown as TradeHistory)).toEqual(
            10000
        );
    });

    it('should return 0 if no trades are provided', () => {
        expect(computeNetValue([])).toEqual(0);
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
        // expect(convertTradeHistoryToTableData(trade)).toEqual({
        //     position: 'Borrow',
        //     contract: 'USDC-DEC22',
        //     apy: new Rate(1000),
        //     notional: BigNumber.from(1000),
        //     currency: 'USDC',
        //     presentValue: BigNumber.from(1000),
        //     dayToMaturity: 69,
        //     forwardValue: BigNumber.from(1000),
        // });
        expect(convertTradeHistoryToTableData(trade).contract).toEqual(
            'USDC-DEC22'
        );
    });
});
