import { useQueryClient } from '@tanstack/react-query';
import { ContractTransaction } from 'ethers';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { QUERIES_TO_INVALIDATE } from 'src/hooks/queries';
import { updateLastActionTimestamp } from 'src/store/blockchain';

export const useHandleContractTransaction = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const handleContractTransaction = useCallback(
        async (tx: ContractTransaction | undefined) => {
            if (!tx) {
                return false;
            }
            const contractReceipt = await tx.wait();
            dispatch(updateLastActionTimestamp());

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
        [dispatch, queryClient]
    );
    return handleContractTransaction;
};
