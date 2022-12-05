import { BigNumber } from 'ethers';
import mockDate from 'mockdate';
import { Rate } from './rate';

beforeEach(() => {
    mockDate.reset();
    mockDate.set('2022-12-01T11:00:00.00Z');
});

describe('Rate class', () => {
    it('should return the correct rate', () => {
        const rate = new Rate(123);
        expect(rate.toNumber()).toBe(123);
    });

    it('should return the correct rate as a percent', () => {
        const rate = new Rate(10000);
        expect(rate.toPercent()).toBe('1%');
    });

    it('should build from the price and maturity', () => {
        const maturityMar23 = BigNumber.from(1675252800);
        const priceYieldDayToMaturity: [BigNumber, BigNumber, BigNumber][] = [
            [BigNumber.from(16537), BigNumber.from(9723), maturityMar23], // 97.236
            [BigNumber.from(18053), BigNumber.from(9698), maturityMar23],
            [BigNumber.from(18538), BigNumber.from(9690), maturityMar23],
            [BigNumber.from(18842), BigNumber.from(9685), maturityMar23],
            [BigNumber.from(19207), BigNumber.from(9679), maturityMar23],
            [BigNumber.from(19511), BigNumber.from(9674), maturityMar23],
            [BigNumber.from(19755), BigNumber.from(9670), maturityMar23],
            [BigNumber.from(19876), BigNumber.from(9668), maturityMar23],
        ];

        priceYieldDayToMaturity.forEach(([yield_, price, maturity]) => {
            const rate = Rate.fromPrice(price, maturity);
            expect(rate.toNumber()).toBe(yield_.toNumber());
        });
    });
});
