import blockchainSlice from './reducer';

export const {
    updateLatestBlock,
    updateChainId,
    updateChainError,
    updateLastActionTimestamp,
} = blockchainSlice.actions;
export default blockchainSlice.reducer;

export * from './selector';
