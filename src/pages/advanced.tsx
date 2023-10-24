import Router from 'next/router';
import { Landing } from 'src/components/pages';
import { useIsMarketTerminated, useOpenMarketExists } from 'src/hooks';

const Advanced = () => {
    const { data: isTerminated } = useIsMarketTerminated();

    const openMarketExists = useOpenMarketExists();

    if (isTerminated) {
        Router.push('/emergency');
        return null;
    }

    if (!openMarketExists) {
        Router.push('/itayose');
        return null;
    }

    return <Landing view='Advanced' />;
};

export default Advanced;
