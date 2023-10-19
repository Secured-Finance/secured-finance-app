import ErrorPage from 'next/error';
import { MarketDashboard } from 'src/components/pages';
import { useIsMarketTerminated } from 'src/hooks';

const Dashboard = () => {
    const { data: isTerminated } = useIsMarketTerminated();
    if (isTerminated) return <ErrorPage statusCode={404} />;

    return <MarketDashboard />;
};

export default Dashboard;
