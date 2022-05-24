import transactionSlice from './reducer';

export const {
    updateHash,
    updateStatus,
    updateSettlementHash,
    updateTransaction,
    transactionFailed,
} = transactionSlice.actions;

export default transactionSlice.reducer;
