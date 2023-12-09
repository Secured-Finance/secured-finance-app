import Router from 'next/router';
import { Itayose as ItayoseComponent } from 'src/components/pages';
import {
    baseContracts,
    useIsMarketTerminated,
    useLendingMarkets,
} from 'src/hooks';
import { getCurrencyMapAsList } from 'src/utils';

const Itayose = () => {
    const { data: isTerminated, isLoading: isLoadingMarketTerminated } =
        useIsMarketTerminated();

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

    for (const ccy of getCurrencyMapAsList()) {
        for (const maturity of Object.keys(lendingMarkets[ccy.symbol])) {
            const contract = lendingMarkets[ccy.symbol][Number(maturity)];
            if (contract.isItayosePeriod || contract.isPreOrderPeriod) {
                return <ItayoseComponent />;
            }
        }
    }

    Router.push('/');
    return null;
};

export default Itayose;
