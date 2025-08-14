import { renderHook } from 'src/test-utils';
import { useHandleContractTransaction } from './useHandleContractTransaction';

describe('useHandleContractTransaction', () => {
    const txHash = '0x1234';

    it('should return a function', () => {
        const { result } = renderHook(() => useHandleContractTransaction());
        expect(typeof result.current).toBe('function');
    });

    it('should return true if the contract receipt has a block number', async () => {
        const { result } = renderHook(() => useHandleContractTransaction());
        const resultValue = await result.current(txHash);
        expect(resultValue).toBe(true);
    });

    it('should return false if the contract receipt does not have a block number', async () => {
        const { result } = renderHook(() => useHandleContractTransaction());
        const resultValue = await result.current('');
        expect(resultValue).toBe(false);
    });

    it('should return false if the transaction is undefined', async () => {
        const { result } = renderHook(() => useHandleContractTransaction());
        const resultValue = await result.current(undefined);
        expect(resultValue).toBe(false);
    });

    it('should dispatch updateLastActionTimestamp', async () => {
        const { result, store } = renderHook(() =>
            useHandleContractTransaction(),
        );
        expect(store.getState().blockchain.lastActionTimestamp).toBeFalsy();
        await result.current(txHash);
        expect(store.getState().blockchain.lastActionTimestamp).toBeTruthy();
    });
});
