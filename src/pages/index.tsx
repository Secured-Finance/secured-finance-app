import { useEffect, useState } from 'react';
import { Landing } from 'src/components/pages';
function EntryPoint() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return <Landing />;
}

export default EntryPoint;
