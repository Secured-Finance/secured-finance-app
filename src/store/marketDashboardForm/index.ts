import marketDashboardFormSlice, { selectMarketDashboardForm } from './reducer';

export default marketDashboardFormSlice.reducer;
export const {
    setCurrency,
    setMaturity,
    setSide,
    setAmount,
    setUnitPrice,
    setOrderType,
} = marketDashboardFormSlice.actions;

export { selectMarketDashboardForm };
