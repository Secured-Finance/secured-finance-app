/**
 * Custom GraphQL fetcher for Points API with authentication
 * This fetcher automatically includes Bearer token from cookies
 */

export function pointsFetcher<
    TData,
    TVariables extends Record<string, unknown>
>(query: string, variables?: TVariables, options?: RequestInit['headers']) {
    return async (): Promise<TData> => {
        // Extract authentication token from cookies (client-side only)
        const cookieString =
            typeof document !== 'undefined' ? document.cookie : '';
        const verifiedDataCookie = cookieString
            .split('; ')
            .find(row => row.startsWith('verified_data='));

        let token = '';
        if (verifiedDataCookie) {
            try {
                const cookieValue = decodeURIComponent(
                    verifiedDataCookie.split('=')[1]
                );
                const verifiedData = JSON.parse(cookieValue);
                token = verifiedData.token || '';
            } catch (e) {
                // Cookie parsing failed, continue without token
            }
        }

        // Prepare headers with optional authentication
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options as Record<string, string>),
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Make the GraphQL request
        const res = await fetch(
            'https://dev-point-api.secured.finance/graphql',
            {
                method: 'POST',
                headers,
                body: JSON.stringify({ query, variables }),
            }
        );

        const json = await res.json();

        // Handle GraphQL errors
        if (json.errors) {
            const { message } = json.errors[0];
            throw new Error(message);
        }

        return json.data;
    };
}
