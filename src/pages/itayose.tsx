import Router from 'next/router';
import { Itayose as ItayoseComponent } from 'src/components/pages';
import {
    baseContracts,
    useCurrencies,
    useIsMarketTerminated,
    useLendingMarkets,
} from 'src/hooks';

const Itayose = () => {
    const { data: isTerminated, isLoading: isLoadingMarketTerminated } =
        useIsMarketTerminated();
    const { data: currencies = [] } = useCurrencies();

    const {
        data: lendingMarkets = baseContracts,
        isLoading: isLoadingLendingMarkets,
    } = useLendingMarkets();

    if (isLoadingLendingMarkets || isLoadingMarketTerminated) {
        return null;
    }

    if (isTerminated) {
        Router.push('/emergency');
        return null;
    }

    for (const ccy of currencies) {
        for (const maturity of Object.keys(lendingMarkets[ccy])) {
            const contract = lendingMarkets[ccy][Number(maturity)];
            if (contract.isItayosePeriod || contract.isPreOrderPeriod) {
                return <ItayoseComponent />;
            }
        }
    }

    Router.push('/');
    return null;
};

export default Itayose;
