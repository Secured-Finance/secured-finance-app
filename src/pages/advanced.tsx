import ErrorPage from 'next/error';
import { Landing } from 'src/components/pages';
import { useIsMarketTerminated } from 'src/hooks';

const Advanced = () => {
    const { data: isTerminated } = useIsMarketTerminated();
    if (isTerminated) return <ErrorPage statusCode={404} />;

    return <Landing view='Advanced' />;
};

export default Advanced;
