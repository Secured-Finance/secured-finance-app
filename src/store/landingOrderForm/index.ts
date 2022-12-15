import landingOrderFormSlice, { selectLandingOrderForm } from './reducer';

export default landingOrderFormSlice.reducer;
export const {
    setCurrency,
    setMaturity,
    setSide,
    setAmount,
    setRate,
    setOrderType,
} = landingOrderFormSlice.actions;

export { selectLandingOrderForm };
