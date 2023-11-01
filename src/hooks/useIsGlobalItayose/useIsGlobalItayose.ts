import { baseContracts, useLendingMarkets } from 'src/hooks/useLendingMarkets';
import { getCurrencyMapAsList } from 'src/utils';

export const useIsGlobalItayose = () => {
    const { data: lendingContracts = baseContracts, isLoading } =
        useLendingMarkets();

    if (isLoading) {
        return {
            data: false,
            isLoading: true,
        };
    }

    let itayoseMarketCount = 0;
    let openMarketExists = false;

    for (const ccy of getCurrencyMapAsList()) {
        if (openMarketExists) {
            break;
        }
        for (const maturity of Object.keys(lendingContracts[ccy.symbol])) {
            const contract = lendingContracts[ccy.symbol][Number(maturity)];
            if (contract.isOpened) {
                openMarketExists = true;
                break;
            }
            if (contract.isPreOrderPeriod || contract.isItayosePeriod) {
                itayoseMarketCount += 1;
            }
        }
    }

    return {
        data: !openMarketExists && itayoseMarketCount >= 1,
        isLoading: false,
    };
};
