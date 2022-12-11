import advancedLendingFormSlice, { selectAdvancedLendingForm } from './reducer';

export default advancedLendingFormSlice.reducer;
export const {
    setCurrency,
    setMaturity,
    setSide,
    setAmount,
    setRate,
    setOrderType,
} = advancedLendingFormSlice.actions;

export { selectAdvancedLendingForm };
