import { getCurrencyMapAsList } from 'src/utils';
import { baseContracts, useLendingMarkets } from 'src/hooks/useLendingMarkets';

export const useOpenMarketExists = () => {
    const { data: lendingContracts = baseContracts } = useLendingMarkets();

    for (const ccy of getCurrencyMapAsList()) {
        for (const maturity of Object.keys(lendingContracts[ccy.symbol])) {
            const contract = lendingContracts[ccy.symbol][Number(maturity)];
            if (contract.isOpened) {
                return true;
            }
        }
    }

    return false;
};
