import { useRouter } from 'next/router';
import { PortfolioManagement } from 'src/components/pages';
import { useIsMarketTerminated } from 'src/hooks';

const Portfolio = () => {
    const { data: isTerminated, isPending: isPendingMarketTerminated } =
        useIsMarketTerminated();

    const router = useRouter();

    if (isPendingMarketTerminated) {
        return null;
    }

    if (isTerminated) {
        router.push('/emergency');
        return null;
    }

    return <PortfolioManagement />;
};

export default Portfolio;
