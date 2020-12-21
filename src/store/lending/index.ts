import { LendingStore } from "./types";
export type { LendingStore } from "./types"

export { default } from './reducer'
export { updateSelectedCurrency, updateCurrencyIndex, updateBorrowAmount, updateCollateralAmount, updateCollateralCurrency, updateSelectedTerms, updateTermsIndex, updateBorrowRate, updateMainCurrency, updateMainCollateralCurrency, updateLendAmount, updateLendRate, updateMainTerms } from './actions'

export const lendingSelector = (state: { lending: LendingStore }) => state.lending