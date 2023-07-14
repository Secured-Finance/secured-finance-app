import { maturities, dec24Fixture } from 'src/stories/mocks/fixtures';
import { renderHook } from 'src/test-utils';
import { useLoanValues, RateType } from './useLoanValues';
import { LoanValue } from 'src/utils/entities/loanValue';

describe('useLoanValues', () => {
    const keys: string[] = Object.keys(maturities);
    it('should return a map of Loan Values of borrow unit prices', async () => {
        const { result } = renderHook(() =>
            useLoanValues(maturities, RateType.Borrow)
        );
        expect(result.current.size).toBe(9);
        for (let i = 0; i < 9; i++) {
            const maturity = Number(keys[i]);
            const loanValue = LoanValue.fromPrice(
                maturities[maturity].borrowUnitPrice,
                maturity
            );
            expect(result.current.get(maturity)).toStrictEqual(loanValue);
        }
    });

    it('should return a map of Loan Values of lend unit prices', async () => {
        const { result } = renderHook(() =>
            useLoanValues(maturities, RateType.Lend)
        );
        expect(result.current.size).toBe(9);
        for (let i = 0; i < 9; i++) {
            const maturity = Number(keys[i]);
            const loanValue = LoanValue.fromPrice(
                maturities[maturity].lendUnitPrice,
                maturity
            );
            expect(result.current.get(maturity)).toStrictEqual(loanValue);
        }
    });

    it('should return a map of Loan Values of mid unit prices', async () => {
        const { result } = renderHook(() =>
            useLoanValues(maturities, RateType.MidRate)
        );
        expect(result.current.size).toBe(9);
        for (let i = 0; i < 9; i++) {
            const maturity = Number(keys[i]);
            const loanValue = LoanValue.fromPrice(
                maturities[maturity].midUnitPrice,
                maturity
            );
            expect(result.current.get(maturity)).toStrictEqual(loanValue);
        }
    });

    it('should return a map of Loan Values of filtered market borrow unit prices', async () => {
        const { result } = renderHook(() =>
            useLoanValues(
                maturities,
                RateType.MidRate,
                market => market.isOpened
            )
        );
        expect(result.current.size).toBe(8);
        for (let i = 0; i < 8; i++) {
            const maturity = Number(keys[i]);
            if (maturities[maturity].isOpened) {
                const loanValue = LoanValue.fromPrice(
                    maturities[maturity].midUnitPrice,
                    maturity
                );
                expect(result.current.get(maturity)).toStrictEqual(loanValue);
            } else {
                expect(maturity).toBe(dec24Fixture);
            }
        }
    });
});
