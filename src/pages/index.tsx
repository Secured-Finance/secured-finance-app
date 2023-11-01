import Router from 'next/router';
import { useEffect, useState } from 'react';
import { Landing } from 'src/components/pages';
import { useIsGlobalItayose, useIsMarketTerminated } from 'src/hooks';

function EntryPoint() {
    const [isMounted, setIsMounted] = useState(false);
    const { data: isTerminated, isLoading: isLoadingMarketTerminated } =
        useIsMarketTerminated();

    const { data: isGlobalItayose, isLoading: isLoadingGlobalItayose } =
        useIsGlobalItayose();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted || isLoadingGlobalItayose || isLoadingMarketTerminated) {
        return null;
    }

    if (isTerminated) {
        Router.push('/emergency');
        return null;
    }

    if (isGlobalItayose) {
        Router.push('/global-itayose');
        return null;
    }

    return <Landing />;
}

export default EntryPoint;
