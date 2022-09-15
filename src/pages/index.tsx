import Head from 'next/head';
import { useEffect, useState } from 'react';
import SecuredFinanceApp from 'src/App';
function EntryPoint() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <div>
            <Head>
                <title>Secured Finance</title>
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1.0'
                />
            </Head>
            <SecuredFinanceApp />
        </div>
    );
}

export default EntryPoint;
