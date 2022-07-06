import landingOrderFormSlice from './reducer';

export default landingOrderFormSlice.reducer;
export const { setCurrency, setTerm, setSide, setAmount, setRate } =
    landingOrderFormSlice.actions;
