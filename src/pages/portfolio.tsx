import ErrorPage from 'next/error';
import { PortfolioManagement } from 'src/components/pages';
import { useIsMarketTerminated } from 'src/hooks';

const Portfolio = () => {
    const { data: isTerminated } = useIsMarketTerminated();
    if (isTerminated) return <ErrorPage statusCode={404} />;

    return <PortfolioManagement />;
};

export default Portfolio;
