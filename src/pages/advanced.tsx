import { useRouter } from 'next/router';
import { Landing } from 'src/components/pages';
import { useIsGlobalItayose, useIsMarketTerminated } from 'src/hooks';

const Advanced = () => {
    const { data: isTerminated, isPending: isLoadingMarketTerminated } =
        useIsMarketTerminated();

    const { data: isGlobalItayose, isLoading: isLoadingGlobalItayose } =
        useIsGlobalItayose();

    const router = useRouter();

    if (isLoadingMarketTerminated || isLoadingGlobalItayose) {
        return null;
    }

    if (isTerminated && typeof window !== 'undefined') {
        router.push('/emergency');
        return null;
    }

    if (isGlobalItayose && typeof window !== 'undefined') {
        router.push('/global-itayose');
        return null;
    }

    return <Landing view='Advanced' />;
};

export default Advanced;
