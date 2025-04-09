import { useRouter } from 'next/router';
import { Stats } from 'src/components/pages';
import { useIsMarketTerminated } from 'src/hooks';

const StatsDashboard = () => {
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

    return <Stats />;
};

export default StatsDashboard;
