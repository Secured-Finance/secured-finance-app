import { ContractTransaction } from 'ethers';

export const handleContractTransaction = async (
    tx: ContractTransaction | undefined
) => {
    const contractReceipt = await tx?.wait();
    if (contractReceipt && contractReceipt.blockNumber) {
        return true;
    }
    return false;
};
