import { Cookies } from 'react-cookie';

const GRAPHQL_ENDPOINT =
    'https://api.studio.thegraph.com/query/30564/sf-protocol-dev-sepolia/0.1.6';

/**
 * Configuration for generated hooks to use the correct endpoint
 */
export const getGraphQLConfig = () => {
    const token = new Cookies().get('verified_data')?.token;

    return {
        endpoint: GRAPHQL_ENDPOINT,
        fetchParams: {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { authorization: `Bearer ${token}` }),
            },
        },
    };
};
