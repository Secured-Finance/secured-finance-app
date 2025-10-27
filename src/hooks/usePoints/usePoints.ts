import { useGetUserQuery, useVerifyMutation } from 'src/generated/points';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useAccount } from 'wagmi';

const POLL_INTERVAL = 600000; // 10 minutes

export const usePoints = () => {
    const { address } = useAccount();
    const [cookies, setCookie, removeCookie] = useCookies();

    // React Query hook for getting user data with authentication
    const {
        data: userData,
        isLoading: loadingUser,
        refetch,
    } = useGetUserQuery(
        undefined, // No variables needed for the user query
        {
            refetchInterval: POLL_INTERVAL,
            enabled: Boolean(cookies.verified_data), // Only fetch if authenticated
            retry: (failureCount, error: unknown) => {
                // Don't retry on auth errors
                const errorMessage =
                    error instanceof Error ? error.message : String(error);
                if (
                    errorMessage.includes('Unauthorized') ||
                    errorMessage.includes('401')
                ) {
                    removeCookie('verified_data');
                    return false;
                }
                return failureCount < 3;
            },
        }
    );

    // React Query mutation for verification
    const verifyMutation = useVerifyMutation({
        onSuccess: data => {
            if (data?.verify) {
                const expires = dayjs().add(1, 'day').toDate();
                const verifiedData = {
                    token: data.verify.token,
                    walletAddress: data.verify.walletAddress,
                };
                setCookie('verified_data', verifiedData, {
                    expires,
                });
            }
        },
        onError: error => {
            console.error('Verification failed:', error);
            removeCookie('verified_data');
        },
    });

    // Handle wallet address changes - refetch if user data doesn't match current address
    useEffect(() => {
        if (cookies.verified_data && userData?.user) {
            if (userData.user.walletAddress !== address) {
                refetch();
            }
        }
    }, [cookies.verified_data, address, userData?.user, refetch]);

    // Clean up cookies on wallet address mismatch or error
    useEffect(() => {
        const walletAddress = cookies.verified_data?.walletAddress;
        if (walletAddress && address && walletAddress !== address) {
            removeCookie('verified_data');
        }
    }, [cookies.verified_data, address, removeCookie]);

    return {
        user: {
            loading: loadingUser,
            data: userData,
        },
        verification: {
            data: cookies.verified_data,
            verify: verifyMutation.mutate,
            loading: verifyMutation.isPending,
        },
    };
};
