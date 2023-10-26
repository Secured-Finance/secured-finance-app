import Router from 'next/router';
import { Landing } from 'src/components/pages';
import { useIsGlobalItayose, useIsMarketTerminated } from 'src/hooks';

const Advanced = () => {
    const { data: isTerminated } = useIsMarketTerminated();

    const isGlobalItayose = useIsGlobalItayose();

    if (isTerminated) {
        Router.push('/emergency');
        return null;
    }
    if (isGlobalItayose) {
        Router.push('/global-itayose');
        return null;
    }

    return <Landing view='Advanced' />;
};

export default Advanced;
