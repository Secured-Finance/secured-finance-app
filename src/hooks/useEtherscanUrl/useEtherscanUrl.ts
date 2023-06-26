import { useEffect, useState } from 'react';
import useSF from 'src/hooks/useSecuredFinance';

export const useEtherscanUrl = () => {
    const securedFinance = useSF();
    const [etherscanUrl, setEtherscanUrl] = useState('');

    useEffect(() => {
        if (!securedFinance) {
            return;
        }
        const network = securedFinance.config?.network ?? 'unknown';
        const baseUrl =
            network === 'mainnet'
                ? 'https://etherscan.io'
                : `https://${network}.etherscan.io`;

        setEtherscanUrl(baseUrl);
    }, [securedFinance, securedFinance?.config?.network]);

    return etherscanUrl;
};
