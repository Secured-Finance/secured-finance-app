import { CurrencySymbol } from 'src/utils';
import { baseContracts, useLendingMarkets } from './useLendingMarkets';

export const useMarket = (currency: CurrencySymbol, maturity: number) => {
    const { data: lendingMarkets = baseContracts } = useLendingMarkets();
    return lendingMarkets[currency][maturity];
};
