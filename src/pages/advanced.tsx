import Router from 'next/router';
import { useEffect } from 'react';
import { Landing } from 'src/components/pages';
import { useIsMarketTerminated, useIsGlobalItayose } from 'src/hooks';

const Advanced = () => {
    const { data: isTerminated } = useIsMarketTerminated();

    const isGlobalItayose = useIsGlobalItayose();

    useEffect(() => {
        if (isTerminated) {
            Router.push('/emergency');
        }
        if (isGlobalItayose) {
            Router.push('/globalitayose');
        }
    }, [isTerminated, isGlobalItayose]);

    return <Landing view='Advanced' />;
};

export default Advanced;
