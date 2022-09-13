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

    return <SecuredFinanceApp />;
}

export default EntryPoint;
