import { useRouter } from 'next/router';
import { PortfolioManagement } from 'src/components/pages';
import { useIsMarketTerminated } from 'src/hooks';

const Portfolio = () => {
    const { data: isTerminated, isLoading: isLoadingMarketTerminated } =
        useIsMarketTerminated();

    const router = useRouter();

    if (isLoadingMarketTerminated) {
        return null;
    }

    if (isTerminated && typeof window !== 'undefined') {
        router.push('/emergency');
        return null;
    }

    return <PortfolioManagement />;
};

export default Portfolio;
