import { useEffect, useState } from 'react';
import useSF from 'src/hooks/useSecuredFinance';
import { getSupportedNetworks } from 'src/utils';

export const useEtherscanUrl = () => {
    const securedFinance = useSF();
    const [etherscanUrl, setEtherscanUrl] = useState('');

    useEffect(() => {
        if (!securedFinance) {
            return;
        }
        const network = securedFinance.config?.network ?? 'unknown';
        const baseUrl =
            getSupportedNetworks().find(
                n => n.name.toLocaleLowerCase() === network
            )?.blockExplorers?.etherscan?.url || 'https://etherscan.io';

        setEtherscanUrl(baseUrl);
    }, [securedFinance, securedFinance?.config?.network]);

    return etherscanUrl;
};
