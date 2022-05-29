import transactionSlice from './reducer';

export const {
    updateHash,
    updateStatus,
    updateSettlementHash,
    updateTransaction,
    transactionFailed,
    resetTransaction,
} = transactionSlice.actions;

export default transactionSlice.reducer;
