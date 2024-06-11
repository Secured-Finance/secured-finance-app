import { useRouter } from 'next/router';
import { PointsDashboard } from 'src/components/pages';
import { useIsMarketTerminated } from 'src/hooks';

const Points = () => {
    const router = useRouter();
    const { data: isTerminated, isPending: isPendingMarketTerminated } =
        useIsMarketTerminated();

    if (isPendingMarketTerminated) {
        return null;
    }

    if (isTerminated) {
        router.push('/emergency');
        return null;
    }

    return <PointsDashboard />;
};

export default Points;
