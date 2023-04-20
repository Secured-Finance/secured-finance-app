import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContractMap, LendingMarket } from 'src/hooks';
import { CurrencySymbol } from 'src/utils';

export type AvailableContracts = {
    lendingMarkets: Record<CurrencySymbol, ContractMap>;
};

const emptyContract: { EMPTY: LendingMarket } = {
    EMPTY: {
        name: 'EMPTY',
        maturity: 0,
        isActive: false,
        utcOpeningDate: 0,
        midUnitPrice: 0,
        isReady: false,
        preOpenDate: 0,
    },
};
const initialState: AvailableContracts = {
    lendingMarkets: {
        [CurrencySymbol.ETH]: emptyContract,
        [CurrencySymbol.EFIL]: emptyContract,
        [CurrencySymbol.USDC]: emptyContract,
        [CurrencySymbol.WBTC]: emptyContract,
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
