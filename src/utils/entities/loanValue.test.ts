import { BigNumber } from 'ethers';
import timemachine from 'timemachine';
import { Maturity } from '.';
import { Rate } from '../rate';
import { LoanValue } from './loanValue';

beforeEach(() => {
    timemachine.reset();
    timemachine.config({
        dateString: '2022-12-01T00:00:00.00Z',
    });
});

describe('LoanValue class', () => {
    const maturityMar23 = new Maturity(1677715200);
    const aprApyPriceMaturity: [BigNumber, BigNumber, number, Maturity][] = [
        [BigNumber.from(152888), BigNumber.from(165044), 9626, maturityMar23], // 96.26
        [BigNumber.from(165826), BigNumber.from(180189), 9595, maturityMar23],
        [BigNumber.from(170008), BigNumber.from(185126), 9585, maturityMar23],
        [BigNumber.from(172101), BigNumber.from(187604), 9580, maturityMar23],
        [BigNumber.from(175871), BigNumber.from(192081), 9571, maturityMar23],
        [BigNumber.from(178386), BigNumber.from(195077), 9565, maturityMar23],
        [BigNumber.from(180483), BigNumber.from(197581), 9560, maturityMar23],
        [BigNumber.from(182582), BigNumber.from(200093), 9555, maturityMar23],
    ];

    it('should build from the price and maturity', () => {
        aprApyPriceMaturity.forEach(([apr, apy, price, maturity]) => {
            const value = LoanValue.fromPrice(price, maturity.toNumber());

            expect(value.apr.toNumber()).toEqual(apr.toNumber());
            expect(value.apy.toNumber()).toEqual(apy.toNumber());
        });
    });

    it('should build from the apy and the maturity', () => {
        aprApyPriceMaturity.forEach(([apr, apy, price, maturity]) => {
            const value = LoanValue.fromApy(
                new Rate(apy.toNumber()),
                maturity.toNumber()
            );
            // expect(value.apr.toNumber()).toEqual(apr.toNumber());
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
            [9626, maturityMar23, 251064],
            [9595, maturityJun23, 129342],
            [9585, maturitySep23, 87200],
            [9580, maturityDec23, 65449],
            [9571, maturityMar24, 53331],
            [9565, maturityJun24, 44846],
            [9560, maturitySep24, 38839],
            [9555, maturityDec24, 34274],
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
            const loanValue = LoanValue.fromPrice(9626, 1677715200);
            expect(loanValue.apy).toEqual(new Rate(165044));
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
            const loanValue = LoanValue.fromPrice(9626, 1677715200);
            expect(loanValue.apr).toEqual(new Rate(152888));
        });
    });

    describe('ZERO', () => {
        it('should return a new instance of LoanValue with price, apy and apr 0', () => {
            expect(LoanValue.ZERO.price).toEqual(0);
            expect(LoanValue.ZERO.apy).toEqual(new Rate(0));
            expect(LoanValue.ZERO.apr).toEqual(new Rate(0));
        });
    });

    describe('getMidValue', () => {
        it('should return the mid value of the loan value', () => {
            const bidValue = LoanValue.fromPrice(9800, 1675252800);
            const askValue = LoanValue.fromPrice(9700, 1675252800);

            const midPrice = (bidValue.price + askValue.price) / 2;

            expect(LoanValue.getMidValue(bidValue, askValue).price).toEqual(
                midPrice
            );
        });

        it('should raise an error if the maturities are different', () => {
            const bidValue = LoanValue.fromPrice(9800, 1675252800);
            const askValue = LoanValue.fromPrice(9700, 1675252801);

            expect(() =>
                LoanValue.getMidValue(bidValue, askValue)
            ).toThrowError('cannot compute mid value: maturity mismatch');
        });
    });
});
