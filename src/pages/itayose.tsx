import { useRouter } from 'next/router';
import { Itayose as ItayoseComponent } from 'src/components/pages';
import {
    baseContracts,
    useCurrencies,
    useIsMarketTerminated,
    useLendingMarkets,
} from 'src/hooks';

const Itayose = () => {
    const { data: isTerminated, isPending: isPendingMarketTerminated } =
        useIsMarketTerminated();
    const { data: currencies = [] } = useCurrencies();

    const router = useRouter();

    const {
        data: lendingMarkets = baseContracts,
        isPending: isPendingLendingMarkets,
    } = useLendingMarkets();

    if (isPendingLendingMarkets || isPendingMarketTerminated) {
        return null;
    }

    if (isTerminated) {
        router.push('/emergency');
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

    return router.push('/');
};

export default Itayose;
