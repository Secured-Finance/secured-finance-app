import Router from 'next/router';
import { MarketDashboard } from 'src/components/pages';
import { useIsMarketTerminated } from 'src/hooks';

const Dashboard = () => {
    const { data: isTerminated } = useIsMarketTerminated();
    if (isTerminated) {
        Router.push('/emergency');
        return null;
    }

    return <MarketDashboard />;
};

export default Dashboard;
