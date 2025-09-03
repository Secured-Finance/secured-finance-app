import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { QUERIES_TO_INVALIDATE } from 'src/hooks/queries';
import { useBlockchainStore } from 'src/store';
import { Hex } from 'viem';
import { usePublicClient } from 'wagmi';

export const useHandleContractTransaction = () => {
    const { updateLastActionTimestamp } = useBlockchainStore();
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
            updateLastActionTimestamp();

            // Invalidate all queries
            await Promise.all(
                QUERIES_TO_INVALIDATE.map(queryKey =>
                    queryClient.invalidateQueries({ queryKey: [queryKey] })
                )
            );
            if (contractReceipt && contractReceipt.blockNumber) {
                return true;
            }
            return false;
        },
        [updateLastActionTimestamp, publicClient, queryClient]
    );
    return handleContractTransaction;
};
