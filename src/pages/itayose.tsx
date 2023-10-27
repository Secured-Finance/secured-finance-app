import ErrorPage from 'next/error';
import Router from 'next/router';
import { Itayose as ItayoseComponent } from 'src/components/pages';
import {
    baseContracts,
    useIsMarketTerminated,
    useLendingMarkets,
} from 'src/hooks';
import { getCurrencyMapAsList } from 'src/utils';

const Itayose = () => {
    const { data: isTerminated } = useIsMarketTerminated();

    const { data: lendingMarkets = baseContracts } = useLendingMarkets();

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

    return <ErrorPage statusCode={404} />;
};

export default Itayose;
