import { useRouter } from 'next/router';
import { MarketDashboard } from 'src/components/pages';
import { useIsMarketTerminated } from 'src/hooks';

const Dashboard = () => {
    const router = useRouter();
    const { data: isTerminated, isLoading: isLoadingMarketTerminated } =
        useIsMarketTerminated();

    if (isLoadingMarketTerminated) {
        return null;
    }

    if (isTerminated && typeof window !== 'undefined') {
        router.push('/emergency');
        return null;
    }

    return <MarketDashboard />;
};

export default Dashboard;
