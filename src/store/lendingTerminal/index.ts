import lendingTerminalSlice from './reducer';
import { LendingTerminalStore } from './types';
export type { LendingTerminalStore, TradingHistoryRow } from './types';

export const {
    setBorrowOrderbook,
    setLendOrderbook,
    setTradingHistory,
    startSetLendingTerminal,
    startSetOrderbook,
    startSetTradingHistory,
    failSetLendingTerminal,
    failSetOrderbook,
    failSetTradingHistory,
    updateBorrowAmount,
    updateBorrowRate,
    updateCurrencyIndex,
    updateLendAmount,
    updateLendRate,
    updateLendingCurrency,
    updateLendingTerms,
    updateMarketAddr,
    updateMarketRate,
    updateSelectedCurrency,
    updateSelectedCurrencyName,
    updateSelectedTerms,
    updateSpread,
    updateTermsIndex,
} = lendingTerminalSlice.actions;

export const lendingTerminalSelector = (state: {
    lendingTerminal: LendingTerminalStore;
}) => state.lendingTerminal;

export default lendingTerminalSlice.reducer;
