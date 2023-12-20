import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useLastPrices } from './useLastPrices';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useLastPrices', () => {
    it('should return the last prices', async () => {
        const { result, waitForNextUpdate } = renderHook(() => useLastPrices());

        await waitForNextUpdate();
        await waitFor(() => expect(result.current.isSuccess).toEqual(true));

        expect(result.current.data).toEqual({
            [CurrencySymbol.ETH]: 2000.34,
            [CurrencySymbol.WFIL]: 6,
            [CurrencySymbol.USDC]: 1,
            [CurrencySymbol.WBTC]: 50000,
        });
    });
});
