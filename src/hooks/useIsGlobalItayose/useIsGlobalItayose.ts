import { getCurrencyMapAsList } from 'src/utils';
import { baseContracts, useLendingMarkets } from 'src/hooks/useLendingMarkets';

export const useIsGlobalItayose = () => {
    const { data: lendingContracts = baseContracts } = useLendingMarkets();

    let itayoseMarketCount = 0;
    let openMarketExists = false;

    for (const ccy of getCurrencyMapAsList()) {
        for (const maturity of Object.keys(lendingContracts[ccy.symbol])) {
            const contract = lendingContracts[ccy.symbol][Number(maturity)];
            if (contract.isOpened) {
                openMarketExists = true;
            }
            if (contract.isPreOrderPeriod || contract.isItayosePeriod) {
                itayoseMarketCount += 1;
            }
        }
    }

    return !openMarketExists && itayoseMarketCount >= 1;
};
