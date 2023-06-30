import availableContractsSlice from './reducer';
import { selectMarket } from './selectors';

export const { updateLendingMarketContract } = availableContractsSlice.actions;
export { selectMarket };
export default availableContractsSlice.reducer;
