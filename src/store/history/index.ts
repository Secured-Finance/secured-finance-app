import historySlice from './reducer';

export default historySlice.reducer;
export const { setBorrowingHistory, setLendingHistory } = historySlice.actions;
