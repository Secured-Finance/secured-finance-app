import availableContractsSlice from './reducer';

export const { updateLendingMarketContract } = availableContractsSlice.actions;
export * from './selectors';
export default availableContractsSlice.reducer;
