import ratesSlice from './reducer';

export const {
    setBorrowingRates,
    setLendingRates,
    setMidRates,
    setRatesFail,
    startSetRates,
} = ratesSlice.actions;

export default ratesSlice.reducer;
