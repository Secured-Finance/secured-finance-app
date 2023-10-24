import Router from 'next/router';
import { useEffect, useState } from 'react';
import { Landing } from 'src/components/pages';
import { useIsMarketTerminated, useOpenMarketExists } from 'src/hooks';

function EntryPoint() {
    const [isMounted, setIsMounted] = useState(false);
    const { data: isTerminated } = useIsMarketTerminated();
    const openMarketExists = useOpenMarketExists();

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

    if (!openMarketExists) {
        Router.push('/itayose');
        return null;
    }

    return <Landing />;
}

export default EntryPoint;
