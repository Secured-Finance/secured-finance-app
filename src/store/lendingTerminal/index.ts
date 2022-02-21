import { LendingTerminalStore } from './types';
export type {
    LendingTerminalStore,
    OrderbookRow,
    TradingHistoryRow,
} from './types';

export { default } from './reducer';
export {
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
} from './actions';

export const lendingTerminalSelector = (state: {
    lendingTerminal: LendingTerminalStore;
}) => state.lendingTerminal;
