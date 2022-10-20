import blockchainSlice from './reducer';

export const { updateLatestBlock, updateChainError } = blockchainSlice.actions;
export default blockchainSlice.reducer;
