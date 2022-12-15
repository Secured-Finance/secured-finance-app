import { BigNumber } from 'ethers';
import mockDate from 'mockdate';
import { Maturity } from '.';
import { Rate } from '../rate';
import { LoanValue } from './loanValue';

beforeEach(() => {
    mockDate.reset();
    mockDate.set('2022-12-01T11:00:00.00Z');
});

describe('LoanValue class', () => {
    const maturityMar23 = new Maturity(1675252800);
    const aprApyPriceMaturity: [BigNumber, BigNumber, number, Maturity][] = [
        [BigNumber.from(18538), BigNumber.from(36901), 9690, maturityMar23], // 96.90
        [BigNumber.from(18721), BigNumber.from(37326), 9687, maturityMar23],
        [BigNumber.from(18842), BigNumber.from(37607), 9685, maturityMar23],
        [BigNumber.from(19207), BigNumber.from(38458), 9679, maturityMar23],
        [BigNumber.from(19511), BigNumber.from(39171), 9674, maturityMar23],
        [BigNumber.from(20791), BigNumber.from(42213), 9653, maturityMar23],
        [BigNumber.from(21401), BigNumber.from(43686), 9643, maturityMar23],
        [BigNumber.from(22378), BigNumber.from(46076), 9627, maturityMar23],
    ];

    it('should build from the price and maturity', () => {
        aprApyPriceMaturity.forEach(([apr, apy, price, maturity]) => {
            const value = LoanValue.fromPrice(price, maturity.toNumber());

            expect(value.apr.toNumber()).toEqual(apr.toNumber());
            expect(value.apy.toNumber()).toEqual(apy.toNumber());
        });
    });

    it.todo('should build from the apy and the maturity', () => {
        aprApyPriceMaturity.forEach(([apr, apy, price, maturity]) => {
            const value = LoanValue.fromApy(
                new Rate(apy.toNumber()),
                maturity.toNumber()
            );
            expect(value.apr.toNumber()).toEqual(apr.toNumber());
            expect(value.price).toEqual(price);
        });
    });

    it('should be able to build a yield curve from a list of prices', () => {
        const maturityMar23 = new Maturity(1675252800);
        const maturityJun23 = new Maturity(1680572800);
        const maturitySep23 = new Maturity(1685892800);
        const maturityDec23 = new Maturity(1691212800);
        const maturityMar24 = new Maturity(1696532800);
        const maturityJun24 = new Maturity(1701852800);
        const maturitySep24 = new Maturity(1707172800);
        const maturityDec24 = new Maturity(1712492800);

        const prices: [number, Maturity, number][] = [
            [9687, maturityMar23, 37326],
            [9685, maturityJun23, 37660],
            [9679, maturitySep23, 38537],
            [9674, maturityDec23, 39259],
            [9653, maturityMar24, 42324],
            [9643, maturityJun24, 43801],
            [9627, maturitySep24, 46219],
            [9617, maturityDec24, 47746],
        ];

        prices.forEach(([price, maturity, apy]) => {
            const value = LoanValue.fromPrice(price, maturity.toNumber());
            expect(value.price).toEqual(price);
            expect(value.apy.toNumber()).toEqual(apy);
        });
    });
});

describe('LoanValue', () => {
    describe('fromPrice', () => {
        it('should return a new instance of LoanValue with the given price and maturity', () => {
            const loanValue = LoanValue.fromPrice(10, 100);
            expect(loanValue).toBeInstanceOf(LoanValue);
            expect(loanValue.price).toEqual(10);
        });
    });

    describe('fromApy', () => {
        it('should return a new instance of LoanValue with the given apy', () => {
            const loanValue = LoanValue.fromApy(new Rate(10000), 100);
            expect(loanValue).toBeInstanceOf(LoanValue);
            expect(loanValue.apy).toEqual(new Rate(10000));
        });
    });

    describe('fromApr', () => {
        it('should return a new instance of LoanValue with the given apr', () => {
            const loanValue = LoanValue.fromApr(new Rate(5000));
            expect(loanValue).toBeInstanceOf(LoanValue);
            expect(loanValue.apr).toEqual(new Rate(5000));
        });
    });

    describe('price', () => {
        it('should return the price when it was set', () => {
            const loanValue = LoanValue.fromPrice(10, 100);
            expect(loanValue.price).toEqual(10);
        });
    });

    describe('apy', () => {
        it('should return the apy when it was set', () => {
            const loanValue = LoanValue.fromApy(new Rate(0.01), 100);
            expect(loanValue.apy).toEqual(new Rate(0.01));
        });

        it('should compute and return the apy when it was not set but price and maturity are set', () => {
            const loanValue = LoanValue.fromPrice(9690, 1675252800);
            expect(loanValue.apy).toEqual(new Rate(36901));
        });

        it('should return 0 if price is 0', () => {
            const loanValue = LoanValue.fromPrice(0, 1675252800);
            expect(loanValue.apy).toEqual(new Rate(0));
        });

        it('should return 0 if the maturity is 0', () => {
            const loanValue = LoanValue.fromPrice(9690, 0);
            expect(loanValue.apy).toEqual(new Rate(0));
        });

        it('should throw an error if apy is undefined and price is undefined', () => {
            const loanValue = LoanValue.fromApr(new Rate(0.05));
            expect(() => loanValue.apy).toThrowError('cannot compute apy');
        });
    });

    describe('apr', () => {
        it('should return the apr when it was set', () => {
            const loanValue = LoanValue.fromApr(new Rate(0.05));
            expect(loanValue.apr).toEqual(new Rate(0.05));
        });

        it('should compute and return the apr when it was not set but price and maturity are set', () => {
            const loanValue = LoanValue.fromPrice(9690, 1675252800);
            expect(loanValue.apr).toEqual(new Rate(18538));
        });
    });

    describe('ZERO', () => {
        it('should return a new instance of LoanValue with price, apy and apr 0', () => {
            expect(LoanValue.ZERO.price).toEqual(0);
            expect(LoanValue.ZERO.apy).toEqual(new Rate(0));
            expect(LoanValue.ZERO.apr).toEqual(new Rate(0));
        });
    });
});
