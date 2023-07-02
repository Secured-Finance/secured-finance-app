import { CurrencySymbol } from 'src/utils';
import { RootState } from '../types';

export const selectMarket =
    (currency: CurrencySymbol, term: string) => (state: RootState) => {
        return state.availableContracts.lendingMarkets[currency][term];
    };
