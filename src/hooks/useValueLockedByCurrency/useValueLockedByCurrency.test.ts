import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { useValueLockedByCurrency } from './useValueLockedByCurrency';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useValueLockedByCurrency', () => {
    it('should return the order fee for a currency', async () => {
        const { result } = renderHook(() => useValueLockedByCurrency());
        const value = result.current;
        expect(value.data).toEqual(undefined);
        expect(value.isPending).toEqual(true);

        await waitFor(() => {
            expect(mock.getProtocolDepositAmount).toHaveBeenCalledTimes(1);
            const newValue = result.current;
            expect(newValue.data).toEqual({
                ETH: BigInt('100000000000000000000'), // 100 ETH
                WFIL: BigInt('100000000000000000000000'), // 100 000 FIL
                USDC: BigInt('1000000000000'), // 1 000 000 USDC
                WBTC: BigInt('1000000000000'), // 1000 BTC
            });
            expect(newValue.isPending).toEqual(false);
        });
    });
});
