import { Cookies } from 'react-cookie';
import { useSelector } from 'react-redux';
import { getSubgraphUrl } from './env';
import { RootState } from 'src/store/types';

// Fallback endpoint (current hardcoded one becomes fallback)
const FALLBACK_GRAPHQL_ENDPOINT =
    'https://api.studio.thegraph.com/query/30564/sf-protocol-dev-sepolia/0.1.6';

/**
 * Configuration for generated hooks to use the correct multi-chain endpoint
 * This preserves the getSubgraphUrl logic for issue-067 multi-chain support
 */
export const getGraphQLConfig = (chainId?: number) => {
    const token = new Cookies().get('verified_data')?.token;

    // Use multi-chain endpoint logic from env.ts
    const subgraphUrl = chainId ? getSubgraphUrl(chainId) : undefined;
    const endpoint = subgraphUrl || FALLBACK_GRAPHQL_ENDPOINT;

    return {
        endpoint,
        fetchParams: {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { authorization: `Bearer ${token}` }),
            },
        },
    };
};

/**
 * React hook that provides GraphQL config with current chain ID
 * Use this in components instead of getGraphQLConfig() directly
 */
export const useGraphQLConfig = () => {
    const chainId = useSelector((state: RootState) => state.blockchain.chainId);
    return getGraphQLConfig(chainId);
};
