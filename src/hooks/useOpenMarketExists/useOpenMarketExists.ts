import { CurrencySymbol } from 'src/utils';
import { baseContracts, useLendingMarkets } from 'src/hooks/useLendingMarkets';

export const useOpenMarketExists = () => {
    const { data: lendingContracts = baseContracts } = useLendingMarkets();

    const currency = CurrencySymbol.ETH;

    for (const maturity of Object.keys(lendingContracts[currency])) {
        const contract = lendingContracts[currency][Number(maturity)];
        if (contract.isOpened) {
            return true;
        }
    }

    return false;
};
