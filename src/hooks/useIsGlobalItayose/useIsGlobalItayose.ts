import { baseContracts, useLendingMarkets } from 'src/hooks/useLendingMarkets';
import { useCurrencies } from '../useCurrencies';

export const useIsGlobalItayose = () => {
    const { data: lendingContracts = baseContracts, isLoading } =
        useLendingMarkets();
    const { data: currencies } = useCurrencies();

    if (isLoading || !currencies) {
        return {
            data: false,
            isLoading: isLoading,
        };
    }

    let itayoseMarketCount = 0;
    let openMarketExists = false;

    for (const ccy of currencies) {
        if (openMarketExists) {
            break;
        }
        for (const maturity of Object.keys(lendingContracts[ccy])) {
            const contract = lendingContracts[ccy][Number(maturity)];
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
