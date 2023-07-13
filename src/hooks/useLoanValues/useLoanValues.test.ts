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
        for (let i = 0; i < 9; i++) {
            const loanValue = LoanValue.fromPrice(
                maturities[Number(keys[i])].borrowUnitPrice,
                Number(keys[i])
            );
            expect(result.current.get(Number(keys[i]))).toStrictEqual(
                loanValue
            );
        }
    });

    it('should return an array of Loan Values of lend unit prices', async () => {
        const { result } = renderHook(() =>
            useLoanValues(maturities, RateType.Lend)
        );
        for (let i = 0; i < 9; i++) {
            const loanValue = LoanValue.fromPrice(
                maturities[Number(keys[i])].lendUnitPrice,
                Number(keys[i])
            );
            expect(result.current.get(Number(keys[i]))).toStrictEqual(
                loanValue
            );
        }
    });

    it('should return an array of Loan Values of mid unit prices', async () => {
        const { result } = renderHook(() =>
            useLoanValues(maturities, RateType.MidRate)
        );
        for (let i = 0; i < 9; i++) {
            const loanValue = LoanValue.fromPrice(
                maturities[Number(keys[i])].midUnitPrice,
                Number(keys[i])
            );
            expect(result.current.get(Number(keys[i]))).toStrictEqual(
                loanValue
            );
        }
    });
});
