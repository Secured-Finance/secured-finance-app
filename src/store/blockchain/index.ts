import blockchainSlice from './reducer';

export const {
    updateLatestBlock,
    updateChainError,
    updateLastActionTimestamp,
} = blockchainSlice.actions;
export default blockchainSlice.reducer;

export * from './selector';
