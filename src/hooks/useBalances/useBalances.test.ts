import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useBalances, zeroBalances } from './useBalances';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

const preloadedState = { wallet: { address: '0x1', ethBalance: 0 } };

describe('useBalances', () => {
    it('should return balances of all currencies', async () => {
        const { result, waitForNextUpdate } = renderHook(() => useBalances(), {
            preloadedState: preloadedState,
        });

        expect(result.current).toEqual(zeroBalances);
        await waitForNextUpdate();
        expect(result.current).toEqual({
            [CurrencySymbol.ETH]: 0,
            [CurrencySymbol.WFIL]: 10000,
            [CurrencySymbol.WBTC]: 300,
            [CurrencySymbol.USDC]: 4000,
        });
    });
});
