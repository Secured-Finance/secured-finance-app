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
    const aprPriceMaturity: [BigNumber, number, Maturity][] = [
        [BigNumber.from(155839), 9626, maturityMar23], // 96.26
        [BigNumber.from(169301), 9595, maturityMar23],
        [BigNumber.from(173663), 9585, maturityMar23],
        [BigNumber.from(175847), 9580, maturityMar23],
        [BigNumber.from(179784), 9571, maturityMar23],
        [BigNumber.from(182412), 9565, maturityMar23],
        [BigNumber.from(184606), 9560, maturityMar23],
        [BigNumber.from(186801), 9555, maturityMar23],
    ];

    it('should build from the price and maturity', () => {
        aprPriceMaturity.forEach(([apr, price, maturity]) => {
            const value = LoanValue.fromPrice(price, maturity.toNumber());

            expect(value.apr.toNumber()).toEqual(apr.toNumber());
        });
    });

    it('should build from the apr and the maturity', () => {
        aprPriceMaturity.forEach(([apr, price, maturity]) => {
            const value = LoanValue.fromApr(
                new Rate(apr.toNumber()),
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
            [9626, maturityMar23, 228731],
            [9595, maturityJun23, 124245],
            [9585, maturitySep23, 85423],
            [9580, maturityDec23, 64785],
            [9571, maturityMar24, 53118],
            [9565, maturityJun24, 44850],
            [9560, maturitySep24, 38842],
            [9555, maturityDec24, 34276],
        ];

        prices.forEach(([price, maturity, apr]) => {
            const value = LoanValue.fromPrice(price, maturity.toNumber());
            expect(value.price).toEqual(price);
            expect(value.apr.toNumber()).toEqual(apr);
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

    describe('fromApr', () => {
        it('should return a new instance of LoanValue with the given apr', () => {
            const loanValue = LoanValue.fromApr(new Rate(5000), 100);
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

    describe('apr', () => {
        it('should return the apr when it was set', () => {
            const loanValue = LoanValue.fromApr(new Rate(0.01), 100);
            expect(loanValue.apr).toEqual(new Rate(0.01));
        });

        it('should compute and return the apr when it was not set but price and maturity are set', () => {
            const loanValue = LoanValue.fromPrice(9626, 1677715200);
            expect(loanValue.apr).toEqual(new Rate(155839));
        });

        it('should return 0 if price is 0', () => {
            const loanValue = LoanValue.fromPrice(0, 1675252800);
            expect(loanValue.apr).toEqual(new Rate(0));
        });

        it('should return 0 if the maturity is 0', () => {
            const loanValue = LoanValue.fromPrice(9690, 0);
            expect(loanValue.apr).toEqual(new Rate(0));
        });
    });

    describe('ZERO', () => {
        it('should return a new instance of LoanValue with price and apr 0', () => {
            expect(LoanValue.ZERO.price).toEqual(0);
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
