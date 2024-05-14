import { useRouter } from 'next/router';
import { MarketDashboard } from 'src/components/pages';
import { useIsMarketTerminated } from 'src/hooks';

const Dashboard = () => {
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

    return <MarketDashboard />;
};

export default Dashboard;
