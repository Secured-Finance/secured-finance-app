import { ContractTransaction } from 'ethers';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { updateLastActionTimestamp } from 'src/store/blockchain';

export const useHandleContractTransaction = () => {
    const dispatch = useDispatch();
    const handleContractTransaction = useCallback(
        async (tx: ContractTransaction | undefined) => {
            const contractReceipt = await tx?.wait();
            dispatch(updateLastActionTimestamp());
            if (contractReceipt && contractReceipt.blockNumber) {
                return true;
            }
            return false;
        },
        [dispatch]
    );
    return handleContractTransaction;
};
