import historySlice from './reducer';

export default historySlice.reducer;
export const {
    startSetHistory,
    setBorrowingHistory,
    setLendingHistory,
    failSetBorrowingHistory,
    failSetLendingHistory,
} = historySlice.actions;
