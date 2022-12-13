import landingOrderFormSlice, { selectLandingOrderForm } from './reducer';

export default landingOrderFormSlice.reducer;
export const { setCurrency, setMaturity, setSide, setAmount, setUnitPrice } =
    landingOrderFormSlice.actions;

export { selectLandingOrderForm };
