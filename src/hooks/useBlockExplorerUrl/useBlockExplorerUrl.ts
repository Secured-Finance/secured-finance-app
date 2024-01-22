import { useEffect, useState } from 'react';
import useSF from 'src/hooks/useSecuredFinance';
import { getSupportedNetworks } from 'src/utils';

export const useBlockExplorerUrl = () => {
    const securedFinance = useSF();
    const [blockExplorerUrl, setBlockExplorerUrl] = useState('');

    useEffect(() => {
        if (!securedFinance) {
            return;
        }
        const network = securedFinance.config.chain.id;
        const supportedNetworks = getSupportedNetworks();
        const baseUrl =
            supportedNetworks.find(n => n.id === network)?.blockExplorers
                ?.etherscan?.url || 'https://etherscan.io';

        setBlockExplorerUrl(baseUrl);
    }, [securedFinance, securedFinance?.config.network]);

    return { blockExplorerUrl };
};
