import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContractMap } from 'src/hooks';
import { CurrencySymbol } from 'src/utils';

export type AvailableContracts = {
    lendingMarkets: Record<CurrencySymbol, ContractMap>;
};

const emptyContract = { '': '0' };
const initialState: AvailableContracts = {
    lendingMarkets: {
        [CurrencySymbol.ETH]: emptyContract,
        [CurrencySymbol.FIL]: emptyContract,
        [CurrencySymbol.USDC]: emptyContract,
        [CurrencySymbol.BTC]: emptyContract,
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
