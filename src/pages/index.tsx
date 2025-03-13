import { useRouter } from 'next/router';
import { Landing } from 'src/components/pages';
import {
    useCurrencies,
    useIsGlobalItayose,
    useIsMarketTerminated,
    useLendingMarkets,
} from 'src/hooks';
import { CurrencySymbol } from 'src/utils';

function EntryPoint() {
    const { data: isTerminated, isPending: isPendingMarketTerminated } =
        useIsMarketTerminated();

    const { data: isGlobalItayose, isPending: isPendingGlobalItayose } =
        useIsGlobalItayose();

    const { data: currencies = [] } = useCurrencies();
    const { data: lendingMarkets } = useLendingMarkets();

    const router = useRouter();
    const { market } = router.query;

    const [currencyLabel, maturityLabel] = (
        typeof market === 'string' ? market.split('-') : [currencies[0], null]
    ) as [CurrencySymbol, string];
    const lendingMarket = lendingMarkets?.[currencyLabel] || {};
    const data =
        Object.values(lendingMarket).find(
            ({ name }) => name === maturityLabel
        ) || Object.values(lendingMarket)[0];

    if (isPendingGlobalItayose || isPendingMarketTerminated) {
        return null;
    }

    if (isTerminated) {
        router.push('/emergency');
        return null;
    }

    if (isGlobalItayose) {
        router.push('/global-itayose');
        return null;
    }

    if (data?.isItayosePeriod || data?.isPreOrderPeriod) {
        router.push({
            pathname: '/itayose',
            query: {
                market: `${currencyLabel}-${data.name}`,
            },
        });
    }

    return <Landing />;
}

export default EntryPoint;
