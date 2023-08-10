import { useQueryClient } from '@tanstack/react-query';
import { ContractTransaction } from 'ethers';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { updateLastActionTimestamp } from 'src/store/blockchain';

export const useHandleContractTransaction = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const handleContractTransaction = useCallback(
        async (tx: ContractTransaction | undefined) => {
            const contractReceipt = await tx?.wait();
            dispatch(updateLastActionTimestamp());

            // Invalidate all queries
            await queryClient.invalidateQueries({ queryKey: ['getOrderbook'] });
            if (contractReceipt && contractReceipt.blockNumber) {
                return true;
            }
            return false;
        },
        [dispatch, queryClient]
    );
    return handleContractTransaction;
};
