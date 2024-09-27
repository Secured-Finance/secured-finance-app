import landingOrderFormSlice, { selectLandingOrderForm } from './reducer';

export default landingOrderFormSlice.reducer;
export const {
    setCurrency,
    setMaturity,
    setSide,
    setAmount,
    setUnitPrice,
    setOrderType,
    setLastView,
    setSourceAccount,
    resetUnitPrice,
    resetAmount,
    setIsBorrowedCollateral,
} = landingOrderFormSlice.actions;

export { selectLandingOrderForm };
