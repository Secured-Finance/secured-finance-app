import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContractMap } from 'src/hooks';
import { CurrencySymbol } from 'src/utils';

export type AvailableContracts = {
    lendingMarkets: Record<CurrencySymbol, ContractMap>;
};

const initialState: AvailableContracts = {
    lendingMarkets: {
        [CurrencySymbol.ETH]: {
            DUMMY: {
                ccy: CurrencySymbol.ETH,
                maturity: '0',
                name: 'DUMMY',
            },
        },
        [CurrencySymbol.FIL]: {
            DUMMY: {
                ccy: CurrencySymbol.FIL,
                maturity: '0',
                name: 'DUMMY',
            },
        },
        [CurrencySymbol.USDC]: {
            DUMMY: {
                ccy: CurrencySymbol.USDC,
                maturity: '0',
                name: 'DUMMY',
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
