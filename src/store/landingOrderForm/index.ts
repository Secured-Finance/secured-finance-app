import landingOrderFormSlice, { selectLandingOrderForm } from './reducer';

export default landingOrderFormSlice.reducer;
export const { setCurrency, setTerm, setSide, setAmount, setRate } =
    landingOrderFormSlice.actions;

export { selectLandingOrderForm };
