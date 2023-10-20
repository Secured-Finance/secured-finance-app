import Router from 'next/router';
import { useEffect, useState } from 'react';
import { Landing } from 'src/components/pages';
import { useIsMarketTerminated } from 'src/hooks';

function EntryPoint() {
    const [isMounted, setIsMounted] = useState(false);
    const { data: isTerminated } = useIsMarketTerminated();

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

    return <Landing />;
}

export default EntryPoint;
