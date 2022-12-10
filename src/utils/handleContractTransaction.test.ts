import { ContractTransaction } from 'ethers';
import { handleContractTransaction } from './handleContractTransaction';

describe.skip('handleContractTransaction', () => {
    it('should return true when blockNumber is resolved', async () => {
        const tx = {
            wait: jest.fn(() => Promise.resolve({ blockNumber: 13115215 })),
        } as unknown as ContractTransaction;
        const transactionStatus = await handleContractTransaction(tx);
        expect(transactionStatus).toBeTruthy();
    });

    it('should return false when blockNumber is unresolved', async () => {
        const tx = {
            wait: jest.fn(() => Promise.resolve({ blockNumber: undefined })),
        } as unknown as ContractTransaction;
        const transactionStatus = await handleContractTransaction(tx);
        expect(transactionStatus).toBeFalsy();
    });
});
