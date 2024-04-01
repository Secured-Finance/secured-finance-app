import { useRouter } from 'next/router';
import { Landing } from 'src/components/pages';
import { useIsGlobalItayose, useIsMarketTerminated } from 'src/hooks';

function EntryPoint() {
    const { data: isTerminated, isPending: isLoadingMarketTerminated } =
        useIsMarketTerminated();

    const { data: isGlobalItayose, isLoading: isLoadingGlobalItayose } =
        useIsGlobalItayose();

    const router = useRouter();

    if (isLoadingGlobalItayose || isLoadingMarketTerminated) {
        return null;
    }

    if (typeof window !== 'undefined') {
        if (isTerminated) {
            router.push('/emergency');
            return null;
        }

        if (isGlobalItayose) {
            router.push('/global-itayose');
            return null;
        }
    }

    return <Landing />;
}

export default EntryPoint;
