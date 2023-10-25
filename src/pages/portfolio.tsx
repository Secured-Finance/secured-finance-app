import Router from 'next/router';
import { PortfolioManagement } from 'src/components/pages';
import { useIsMarketTerminated } from 'src/hooks';

const Portfolio = () => {
    const { data: isTerminated } = useIsMarketTerminated();
    if (isTerminated) {
        Router.push('/emergency');
        return null;
    }

    return <PortfolioManagement />;
};

export default Portfolio;
