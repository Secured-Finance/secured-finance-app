import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContractMap } from 'src/hooks';
import { CurrencySymbol } from 'src/utils';

export type AvailableContracts = {
    lendingMarkets: Record<CurrencySymbol, ContractMap>;
};

const initialState: AvailableContracts = {
    lendingMarkets: {
        [CurrencySymbol.ETH]: {
            '': {
                ccy: CurrencySymbol.ETH,
                maturity: '0',
                name: '',
            },
        },
        [CurrencySymbol.FIL]: {
            '': {
                ccy: CurrencySymbol.FIL,
                maturity: '0',
                name: '',
            },
        },
        [CurrencySymbol.USDC]: {
            '': {
                ccy: CurrencySymbol.USDC,
                maturity: '0',
                name: '',
            },
        },
    },
};

const availableContractsSlice = createSlice({
    name: 'availableContracts',
    initialState,
    reducers: {
        updateLendingMarketContract: {
            reducer: (
                state,
                action: PayloadAction<
                    Partial<Record<CurrencySymbol, ContractMap>>
                >
            ) => {
                state.lendingMarkets = {
                    ...state.lendingMarkets,
                    ...action.payload,
                };
            },
            prepare: (payload: ContractMap, ccy: CurrencySymbol) => {
                return { payload: { [ccy]: payload } };
            },
        },
    },
});

export default availableContractsSlice;
