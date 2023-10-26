import Router from 'next/router';
import { useEffect, useState } from 'react';
import { Landing } from 'src/components/pages';
import { useIsMarketTerminated, useIsGlobalItayose } from 'src/hooks';

function EntryPoint() {
    const [isMounted, setIsMounted] = useState(false);
    const { data: isTerminated } = useIsMarketTerminated();
    const isGlobalItayose = useIsGlobalItayose();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    if (isTerminated) {
        Router.push('/emergency');
        return null;
    }

    if (isGlobalItayose) {
        Router.push('/globalitayose');
        return null;
    }

    return <Landing />;
}

export default EntryPoint;
