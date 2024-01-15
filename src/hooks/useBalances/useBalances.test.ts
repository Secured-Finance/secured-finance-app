import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { createCurrencyMap } from 'src/utils';
import { useBalances, zeroBalances } from './useBalances';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

const preloadedState = { wallet: { address: '0x1', ethBalance: 0 } };

describe('useBalances', () => {
    it('should return balances of all currencies', async () => {
        const { result, waitForNextUpdate } = renderHook(() => useBalances(), {
            preloadedState: preloadedState,
        });

        const expected = createCurrencyMap<number>(0);
        expected.WFIL = 10000;
        expected.WBTC = 300;
        expected.USDC = 4000;

        expect(result.current).toEqual(zeroBalances);
        await waitForNextUpdate();
        await waitFor(() => expect(result.current).toEqual(expected));
    });
});
