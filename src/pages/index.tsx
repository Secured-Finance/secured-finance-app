import { useRouter } from 'next/router';
import { Landing } from 'src/components/pages';
import { useIsGlobalItayose, useIsMarketTerminated } from 'src/hooks';

function EntryPoint() {
    const { data: isTerminated, isPending: isPendingMarketTerminated } =
        useIsMarketTerminated();

    const { isPending: isPendingGlobalItayose } = useIsGlobalItayose();

    const router = useRouter();

    if (isPendingGlobalItayose || isPendingMarketTerminated) {
        return null;
    }

    if (isTerminated) {
        router.push('/emergency');
        return null;
    }

    return <Landing />;
}

export default EntryPoint;
