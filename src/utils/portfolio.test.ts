import { TradeHistory } from 'src/hooks';
import { computeNetValue, computeWeightedAverage } from './portfolio';

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
