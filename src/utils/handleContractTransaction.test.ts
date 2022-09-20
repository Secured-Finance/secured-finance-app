/* eslint-disable @typescript-eslint/no-explicit-any */
import { handleContractTransaction } from './handleContractTransaction';

describe('handleContractTransaction', () => {
    it('should return true when blockNumber is resolved', async () => {
        const tx = {
            wait: jest.fn(() => Promise.resolve({ blockNumber: 13115215 })),
        } as any;
        const transactionStatus = await handleContractTransaction(tx);
        expect(transactionStatus).toBeTruthy();
    });

    it('should return false when blockNumber is unresolved', async () => {
        const tx = {
            wait: jest.fn(() => Promise.resolve({ blockNumber: undefined })),
        } as any;
        const transactionStatus = await handleContractTransaction(tx);
        expect(transactionStatus).toBeFalsy();
    });
});
