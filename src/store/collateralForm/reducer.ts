import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CurrencyInfo } from 'src/utils/currencyList';
import { CollateralFormStore, defaultStore } from './types';

const initialStore: CollateralFormStore = defaultStore;

const collateralFormSlice = createSlice({
    name: 'collateralForm',
    initialState: initialStore,
    reducers: {
        updateCollateralCcyIndex(state, action: PayloadAction<number>) {
            state.currencyIndex = action.payload;
        },
        updateCollateralCcyShortName(state, action: PayloadAction<string>) {
            state.currencyShortName = action.payload;
        },
        updateCollateralCcyName(state, action: PayloadAction<string>) {
            state.currencyName = action.payload;
        },
        updateCollateralAmount(state, action: PayloadAction<number>) {
            state.amount = action.payload;
        },
        updateCollateralTxFee(state, action: PayloadAction<number>) {
            state.txFee = action.payload;
        },
        resetCollateralForm(state) {
            state = initialStore;
        },
        fetchCollateralStore(state) {
            state.isLoading = true;
        },
        fetchCollateralStoreFailure(state) {
            state.isLoading = false;
        },
        updateCollateralCurrency(state, action: PayloadAction<CurrencyInfo>) {
            const { shortName, indexCcy, name } = action.payload;
            state.currencyShortName = shortName;
            state.currencyIndex = indexCcy;
            state.currencyName = name;
        },
    },
});

export default collateralFormSlice;
