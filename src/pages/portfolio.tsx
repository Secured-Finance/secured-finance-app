import Router from 'next/router';
import { PortfolioManagement } from 'src/components/pages';
import { useIsMarketTerminated } from 'src/hooks';

const Portfolio = () => {
    const { data: isTerminated, isLoading: isLoadingMarketTerminated } =
        useIsMarketTerminated();

    if (isLoadingMarketTerminated) {
        return null;
    }

    if (isTerminated) {
        Router.push('/emergency');
        return null;
    }

    return <PortfolioManagement />;
};

export default Portfolio;
