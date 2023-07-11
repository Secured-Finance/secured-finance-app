import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContractMap, LendingMarket } from 'src/hooks';
import { CurrencySymbol } from 'src/utils';

export type AvailableContracts = {
    lendingMarkets: Record<CurrencySymbol, ContractMap>;
};

const emptyContract: { 0: LendingMarket } = {
    0: {
        name: 'EMPTY',
        maturity: 0,
        isActive: false,
        utcOpeningDate: 0,
        midUnitPrice: 0,
        preOpenDate: 0,
        openingUnitPrice: 0,
        isReady: false,
        isOpened: false,
        isMatured: false,
        isPreOrderPeriod: false,
        isItayosePeriod: false,
    },
};
const initialState: AvailableContracts = {
    lendingMarkets: {
        [CurrencySymbol.ETH]: emptyContract,
        [CurrencySymbol.WFIL]: emptyContract,
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
