import marketDashboardFormSlice, { selectMarketDashboardForm } from './reducer';

export default marketDashboardFormSlice.reducer;
export const { setCurrency, setMaturity, setSide, setAmount, setRate } =
    marketDashboardFormSlice.actions;

export { selectMarketDashboardForm };
