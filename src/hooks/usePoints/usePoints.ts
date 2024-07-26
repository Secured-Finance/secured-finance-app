import {
    useGetUserLazyQuery,
    useVerifyMutation,
} from '@secured-finance/sf-point-client';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useAccount } from 'wagmi';

const POLL_INTERVAL = 600000; // 10 minutes
const POINT_API_QUERY_OPTIONS = { context: { type: 'point-dashboard' } };

export const usePoints = () => {
    const { address } = useAccount();
    const [cookies, setCookie, removeCookie] = useCookies();
    const [getUser, { data: userData, loading: loadingUser, refetch }] =
        useGetUserLazyQuery({
            pollInterval: POLL_INTERVAL,
            ...POINT_API_QUERY_OPTIONS,
        });

    const [verify, { data: verifyData, loading, error }] = useVerifyMutation(
        POINT_API_QUERY_OPTIONS
    );
    useEffect(() => {
        if (verifyData) {
            const expires = dayjs().add(1, 'day').toDate();
            const verifiedData = {
                token: verifyData?.verify.token,
                walletAddress: verifyData?.verify.walletAddress,
            };
            setCookie('verified_data', verifiedData, {
                expires,
            });
        }
    }, [verifyData, setCookie]);

    useEffect(() => {
        if (cookies.verified_data) {
            userData?.user.walletAddress &&
            userData?.user.walletAddress !== address
                ? refetch()
                : getUser();
        }
    }, [
        cookies.verified_data,
        getUser,
        address,
        userData?.user.walletAddress,
        refetch,
    ]);

    useEffect(() => {
        const walletAddress = cookies.verified_data?.walletAddress;
        if (error || (walletAddress && address && walletAddress !== address)) {
            removeCookie('verified_data');
        }
    }, [error, removeCookie, cookies.verified_data, address]);

    return {
        user: {
            loading: loadingUser,
            data: userData,
        },
        verification: {
            data: cookies.verified_data,
            verify,
            loading,
        },
    };
};
