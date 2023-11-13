import { renderHook } from 'src/test-utils';
import { useHandleContractTransaction } from './useHandleContractTransaction';

describe.skip('useHandleContractTransaction', () => {
    it('should return a function', () => {
        const { result } = renderHook(() => useHandleContractTransaction());
        expect(typeof result.current).toBe('function');
    });

    it('should return true if the contract receipt has a block number', async () => {
        const { result } = renderHook(() => useHandleContractTransaction());
        const mockTransaction = {
            wait: jest.fn(() => Promise.resolve({ blockNumber: 123 })),
        };
        const resultValue = await result.current(mockTransaction);
        expect(resultValue).toBe(true);
    });

    it('should return false if the contract receipt does not have a block number', async () => {
        const { result } = renderHook(() => useHandleContractTransaction());
        const mockTransaction = { wait: jest.fn(() => Promise.resolve({})) };
        const resultValue = await result.current(mockTransaction);
        expect(resultValue).toBe(false);
    });

    it('should return false if the transaction is undefined', async () => {
        const { result } = renderHook(() => useHandleContractTransaction());
        const resultValue = await result.current(undefined);
        expect(resultValue).toBe(false);
    });

    it('should dispatch updateLastActionTimestamp', async () => {
        const { result, store } = renderHook(() =>
            useHandleContractTransaction()
        );
        const mockTransaction = {
            wait: jest.fn(() => Promise.resolve({ blockNumber: 123 })),
        };
        expect(store.getState().blockchain.lastActionTimestamp).toBeFalsy();
        await result.current(mockTransaction);
        expect(store.getState().blockchain.lastActionTimestamp).toBeTruthy();
    });
});
