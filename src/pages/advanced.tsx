import Router from 'next/router';
import { Landing } from 'src/components/pages';
import { useIsMarketTerminated } from 'src/hooks';

const Advanced = () => {
    const { data: isTerminated } = useIsMarketTerminated();

    if (isTerminated) {
        Router.push('/emergency');
        return null;
    }

    return <Landing view='Advanced' />;
};

export default Advanced;
