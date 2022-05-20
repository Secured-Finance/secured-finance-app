import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Currency, CurrencyInfo, getCurrencyBy } from 'src/utils/currencyList';
import { LendingStore } from './types';

const initialStore: LendingStore = {
    selectedCcy: 'FIL',
    selectedCcyName: 'Filecoin',
    currencyIndex: 1,
    collateralCcy: 'ETH',
    collateralCcyName: 'Ethereum',
    collateralCcyIndex: 0,
    selectedTerms: '3 month',
    termsIndex: 0,
    borrowAmount: 0,
    lendAmount: 0,
    collateralAmount: 0,
    borrowRate: 0,
    lendRate: 0,
    isLoading: false,
};

const lendingSlice = createSlice({
    name: 'lending',
    initialState: initialStore,
    reducers: {
        updateLendRate(state, action: PayloadAction<number>) {
            state.lendRate = action.payload;
        },
        updateBorrowRate(state, action: PayloadAction<number>) {
            state.borrowRate = action.payload;
        },
        updateBorrowAmount(state, action: PayloadAction<number>) {
            state.borrowAmount = action.payload;
        },
        updateLendAmount(state, action: PayloadAction<number>) {
            state.lendAmount = action.payload;
        },
        updateCollateralAmount(state, action: PayloadAction<number>) {
            state.collateralAmount = action.payload;
        },
        updateSelectedTerms(state, action: PayloadAction<string>) {
            state.selectedTerms = action.payload;
        },
        updateSelectedCurrency(state, action: PayloadAction<string>) {
            state.selectedCcy = action.payload;
        },
        updateSelectedCurrencyName(state, action: PayloadAction<string>) {
            state.selectedCcyName = action.payload;
        },
        updateSelectedCurrencyIndex(state, action: PayloadAction<number>) {
            state.currencyIndex = action.payload;
        },
        updateCollateralCurrency(state, action: PayloadAction<string>) {
            state.collateralCcy = action.payload;
        },
        updateCollateralCurrencyName(state, action: PayloadAction<string>) {
            state.collateralCcyName = action.payload;
        },
        updateCollateralCurrencyIndex(state, action: PayloadAction<number>) {
            state.collateralCcyIndex = action.payload;
        },
        updateMainCurrency(state, action: PayloadAction<CurrencyInfo>) {
            const { indexCcy, fullName, shortName } = action.payload;
            state.currencyIndex = indexCcy;
            state.selectedCcyName = fullName;
            state.selectedCcy = shortName;
        },
        updateMainCollateralCurrency(state, action: PayloadAction<Currency>) {
            const { indexCcy, fullName, shortName } = getCurrencyBy(
                'shortName',
                action.payload
            );
            state.collateralCcyIndex = indexCcy;
            state.collateralCcyName = fullName;
            state.collateralCcy = shortName;
        },
        updateMainTerms(state, action: PayloadAction<string>) {
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

export default lendingSlice;
