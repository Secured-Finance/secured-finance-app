import Router from 'next/router';
import { useEffect } from 'react';
import { Landing } from 'src/components/pages';
import { useIsMarketTerminated, useOpenMarketExists } from 'src/hooks';

const Advanced = () => {
    const { data: isTerminated } = useIsMarketTerminated();

    const openMarketExists = useOpenMarketExists();

    useEffect(() => {
        if (isTerminated) {
            Router.push('/emergency');
        }
        if (!openMarketExists) {
            Router.push('/itayose');
        }
    }, [isTerminated, openMarketExists]);

    return <Landing view='Advanced' />;
};

export default Advanced;
