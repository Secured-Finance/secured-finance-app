import { useRouter } from 'next/router';
import { Landing } from 'src/components/pages';
import { useIsGlobalItayose, useIsMarketTerminated } from 'src/hooks';

const Simple = () => {
    const { data: isTerminated, isPending: isPendingMarketTerminated } =
        useIsMarketTerminated();

    const { data: isGlobalItayose, isPending: isPendingGlobalItayose } =
        useIsGlobalItayose();

    const router = useRouter();

    if (isPendingMarketTerminated || isPendingGlobalItayose) {
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

    return <Landing view='Simple' />;
};

export default Simple;
