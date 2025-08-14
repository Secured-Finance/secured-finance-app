import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { QUERIES_TO_INVALIDATE } from 'src/hooks/queries';
import { updateLastActionTimestamp } from 'src/store/blockchain';
import { Hex } from 'viem';
import { usePublicClient } from 'wagmi';

export const useHandleContractTransaction = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const publicClient = usePublicClient();

    const handleContractTransaction = useCallback(
        async (tx: Hex | undefined) => {
            if (!tx) {
                return false;
            }
            const contractReceipt =
                await publicClient.waitForTransactionReceipt({
                    hash: tx,
                });
            dispatch(updateLastActionTimestamp());

            // Invalidate all queries
            await Promise.all(
                QUERIES_TO_INVALIDATE.map(queryKey =>
                    queryClient.invalidateQueries({ queryKey: [queryKey] }),
                ),
            );
            if (contractReceipt && contractReceipt.blockNumber) {
                return true;
            }
            return false;
        },
        [dispatch, publicClient, queryClient],
    );
    return handleContractTransaction;
};
