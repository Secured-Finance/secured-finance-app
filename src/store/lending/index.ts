import lendingSlice from './reducer';
import { LendingStore } from './types';
export type { LendingStore } from './types';

export const lendingSelector = (state: { lending: LendingStore }) =>
    state.lending;

export const {
    updateLendRate,
    updateBorrowRate,
    updateBorrowAmount,
    updateLendAmount,
    updateCollateralAmount,
    updateSelectedTerms,
    updateSelectedCurrency,
    updateSelectedCurrencyName,
    updateSelectedCurrencyIndex,
    updateCollateralCurrency,
    updateCollateralCurrencyName,
    updateCollateralCurrencyIndex,
    updateMainCurrency,
    updateMainCollateralCurrency,
    updateMainTerms,
} = lendingSlice.actions;

export default lendingSlice.reducer;
