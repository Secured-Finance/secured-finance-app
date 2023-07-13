import { maturities } from 'src/stories/mocks/fixtures';
import { renderHook } from 'src/test-utils';
import { useLoanValues, RateType } from './useLoanValues';
import { LoanValue } from 'src/utils/entities/loanValue';

describe('useLoanValues', () => {
    const keys: string[] = Object.keys(maturities);
    it('should return an array of Loan Values of borrow unit prices', async () => {
        const { result } = renderHook(() =>
            useLoanValues(maturities, RateType.Borrow)
        );
        expect(result.current.length).toBe(9);

        for (let i = 0; i < 9; i++) {
            const loanValue = LoanValue.fromPrice(
                maturities[Number(keys[i])].borrowUnitPrice,
                maturities[Number(keys[i])].maturity
            );
            expect(result.current[i]).toStrictEqual(loanValue);
        }
    });

    it('should return an array of Loan Values of lend unit prices', async () => {
        const { result } = renderHook(() =>
            useLoanValues(maturities, RateType.Lend)
        );
        expect(result.current.length).toBe(9);

        for (let i = 0; i < 9; i++) {
            const loanValue = LoanValue.fromPrice(
                maturities[Number(keys[i])].lendUnitPrice,
                maturities[Number(keys[i])].maturity
            );
            expect(result.current[i]).toStrictEqual(loanValue);
        }
    });

    it('should return an array of Loan Values of mid unit prices', async () => {
        const { result } = renderHook(() =>
            useLoanValues(maturities, RateType.MidRate)
        );
        expect(result.current.length).toBe(9);

        for (let i = 0; i < 9; i++) {
            const loanValue = LoanValue.fromPrice(
                maturities[Number(keys[i])].midUnitPrice,
                maturities[Number(keys[i])].maturity
            );
            expect(result.current[i]).toStrictEqual(loanValue);
        }
    });
});
