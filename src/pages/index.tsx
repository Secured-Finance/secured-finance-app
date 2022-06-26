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
            <SecuredFinanceApp />
        </div>
    );
}

export default EntryPoint;
