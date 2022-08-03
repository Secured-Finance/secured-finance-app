import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderbookRow } from '@secured-finance/sf-graph-client/dist/hooks/lending-market/common';
import { Currency, currencyMap } from 'src/utils/currencyList';
import { LendingTerminalStore, TradingHistoryRow } from './types';

const initialStore: LendingTerminalStore = {
    market: '',
    selectedCcy: 'FIL',
    selectedCcyName: 'Filecoin',
    currencyIndex: 1,
    selectedTerms: '3 month',
    termsIndex: 0,
    borrowAmount: 0,
    borrowRate: 0,
    lendAmount: 0,
    lendRate: 0,
    spread: 0,
    marketRate: 0,
    lendOrderbook: [],
    borrowOrderbook: [],
    tradingHistory: [],
    isLoading: false,
};

const setToZeroIfNaN = (value: number) => {
    if (isNaN(value)) {
        return 0;
    }
    return value;
};

const lendingTerminalSlice = createSlice({
    name: 'lendingTerminal',
    initialState: initialStore,
    reducers: {
        startSetLendingTerminal(state) {
            state.isLoading = true;
        },
        failSetLendingTerminal(state) {
            state.isLoading = false;
        },
        startSetOrderbook(state) {
            state.isLoading = true;
        },
        failSetOrderbook(state) {
            state.isLoading = false;
        },
        startSetTradingHistory(state) {
            state.isLoading = true;
        },
        failSetTradingHistory(state) {
            state.isLoading = false;
        },
        setBorrowOrderbook(state, action: PayloadAction<Array<OrderbookRow>>) {
            state.borrowOrderbook = action.payload;
        },
        setLendOrderbook(state, action: PayloadAction<Array<OrderbookRow>>) {
            state.lendOrderbook = action.payload;
        },
        setTradingHistory(
            state,
            action: PayloadAction<Array<TradingHistoryRow>>
        ) {
            state.tradingHistory = action.payload;
        },
        updateSelectedTerms(state, action: PayloadAction<string>) {
            state.selectedTerms = action.payload;
        },
        updateTermsIndex(state, action: PayloadAction<number>) {
            state.termsIndex = action.payload;
        },
        updateBorrowAmount(state, action: PayloadAction<number>) {
            state.borrowAmount = setToZeroIfNaN(action.payload);
        },
        updateBorrowRate(state, action: PayloadAction<number>) {
            state.borrowRate = setToZeroIfNaN(action.payload);
        },
        updateLendAmount(state, action: PayloadAction<number>) {
            state.lendAmount = setToZeroIfNaN(action.payload);
        },
        updateLendRate(state, action: PayloadAction<number>) {
            state.lendRate = setToZeroIfNaN(action.payload);
        },
        updateSelectedCurrency(state, action: PayloadAction<string>) {
            state.selectedCcy = action.payload;
        },
        updateSelectedCurrencyName(state, action: PayloadAction<string>) {
            state.selectedCcyName = action.payload;
        },
        updateCurrencyIndex(state, action: PayloadAction<number>) {
            state.currencyIndex = action.payload;
        },
        updateMarketAddr(state, action: PayloadAction<string>) {
            state.market = action.payload;
        },
        updateSpread(state, action: PayloadAction<number>) {
            state.spread = action.payload;
        },
        updateMarketRate(state, action: PayloadAction<number>) {
            state.marketRate = action.payload;
        },
        updateLendingCurrency(state, action: PayloadAction<Currency>) {
            const { indexCcy, name, shortName } = currencyMap[action.payload];
            state.currencyIndex = indexCcy;
            state.selectedCcy = shortName;
            state.selectedCcyName = name;
        },

        updateLendingTerms(state, action: PayloadAction<string>) {
            state.selectedTerms = action.payload;
            switch (action.payload) {
                case '3 month':
                    state.termsIndex = 0;
                    break;
                case '6 month':
                    state.termsIndex = 1;
                    break;
                case '1 year':
                    state.termsIndex = 2;
                    break;
                case '2 year':
                    state.termsIndex = 3;
                    break;
                case '3 year':
                    state.termsIndex = 4;
                    break;
                case '5 year':
                    state.termsIndex = 5;
                    break;
                default:
                    break;
            }
        },
    },
});

export default lendingTerminalSlice;
