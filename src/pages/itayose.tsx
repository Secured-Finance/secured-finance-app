import { useRouter } from 'next/router';
import { Itayose as ItayoseComponent } from 'src/components/pages';
import {
    baseContracts,
    useCurrencies,
    useIsMarketTerminated,
    useLendingMarkets,
} from 'src/hooks';

const Itayose = () => {
    const { data: isTerminated, isPending: isLoadingMarketTerminated } =
        useIsMarketTerminated();
    const { data: currencies = [] } = useCurrencies();

    const router = useRouter();

    const {
        data: lendingMarkets = baseContracts,
        isPending: isLoadingLendingMarkets,
    } = useLendingMarkets();

    if (isLoadingLendingMarkets || isLoadingMarketTerminated) {
        return null;
    }

    if (isTerminated && typeof window !== 'undefined') {
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

    if (typeof window !== 'undefined') {
        router.push('/');
    }

    return null;
};

export default Itayose;
