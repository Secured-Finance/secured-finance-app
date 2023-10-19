import timemachine from 'timemachine';
import { Maturity } from '.';
import { Rate } from '../rate';
import { LoanValue } from './loanValue';

const TEST_DATE = '2022-12-01T00:00:00.00Z';

beforeEach(() => {
    timemachine.reset();
    timemachine.config({
        dateString: TEST_DATE,
    });
});

describe('LoanValue class', () => {
    const maturityMar23 = new Maturity(1677715200);
    const aprPriceMaturity: [bigint, number, Maturity][] = [
        [BigInt(155839), 9626, maturityMar23], // 96.26
        [BigInt(169301), 9595, maturityMar23],
        [BigInt(173663), 9585, maturityMar23],
        [BigInt(175847), 9580, maturityMar23],
        [BigInt(179784), 9571, maturityMar23],
        [BigInt(182412), 9565, maturityMar23],
        [BigInt(184606), 9560, maturityMar23],
        [BigInt(186801), 9555, maturityMar23],
    ];

    it('should build from the price and maturity', () => {
        aprPriceMaturity.forEach(([apr, price, maturity]) => {
            const value = LoanValue.fromPrice(price, maturity.toNumber());

            expect(value.apr.toNumber()).toEqual(Number(apr));
        });
    });

    it('should build from the apr and the maturity', () => {
        aprPriceMaturity.forEach(([apr, price, maturity]) => {
            const value = LoanValue.fromApr(
                new Rate(Number(apr)),
                maturity.toNumber()
            );
            expect(value.apr.toNumber()).toEqual(Number(apr));
            expect(value.price).toEqual(price);
            expect(value.maturity).toEqual(maturity.toNumber());
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
            [9626, maturityMar23, 226902],
            [9595, maturityJun23, 124171],
            [9585, maturitySep23, 85125],
            [9580, maturityDec23, 64727],
            [9571, maturityMar24, 52981],
            [9565, maturityJun24, 44804],
            [9560, maturitySep24, 38755],
            [9555, maturityDec24, 34239],
        ];

        prices.forEach(([price, maturity, apr]) => {
            const value = LoanValue.fromPrice(price, maturity.toNumber());
            expect(value.price).toEqual(price);
            expect(value.apr.toNumber()).toEqual(apr);
            expect(value.maturity).toEqual(maturity.toNumber());
        });
    });
});

describe('APR calculation edge cases', () => {
    it('should return a zero APR if the price is 100', () => {
        const loanValue = LoanValue.fromPrice(10000, 1712492800);
        expect(loanValue.apr.toNumber()).toEqual(0);
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

        it('should compute and return the apr calculated from openingDate when it is provided', () => {
            const loanValue = LoanValue.fromPrice(9626, 1677715200, 1675252800);
            expect(loanValue.apr).toEqual(new Rate(497592));
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
            expect(LoanValue.getMidValue(bidValue, askValue).apr).toEqual(
                new Rate(149743)
            );
        });

        it('should return the mid value of the loan value from the calculationDate', () => {
            const bidValue = LoanValue.fromPrice(9652, 1677715200, 1675252800);
            const askValue = LoanValue.fromPrice(9600, 1677715200, 1675252800);

            const midPrice = (bidValue.price + askValue.price) / 2;

            expect(LoanValue.getMidValue(bidValue, askValue).price).toEqual(
                midPrice
            );
            expect(LoanValue.getMidValue(bidValue, askValue).apr).toEqual(
                new Rate(497592)
            );
        });

        it('should raise an error if the maturities are different', () => {
            const bidValue = LoanValue.fromPrice(9800, 1675252800);
            const askValue = LoanValue.fromPrice(9700, 1675252801);

            expect(() =>
                LoanValue.getMidValue(bidValue, askValue)
            ).toThrowError('cannot compute mid value: maturity mismatch');
        });

        it('should use 0 as the bid price if it is not set', () => {
            const bidValue = LoanValue.fromPrice(0, 1675252800);
            const askValue = LoanValue.fromPrice(9700, 1675252800);

            const midPrice = (0 + askValue.price) / 2;

            expect(LoanValue.getMidValue(bidValue, askValue).price).toEqual(
                midPrice
            );
        });

        it('should use 10000 (100) as the ask price if it is not set', () => {
            const bidValue = LoanValue.fromPrice(9800, 1675252800);
            const askValue = LoanValue.fromPrice(0, 1675252800);

            const midPrice = (bidValue.price + 10000) / 2;

            expect(LoanValue.getMidValue(bidValue, askValue).price).toEqual(
                midPrice
            );
        });
    });
});
