import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useDecimals } from './useDecimals';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useDecimals', () => {
    it('should return the decimals of each currency', async () => {
        const { result } = renderHook(() => useDecimals());

        await waitFor(() =>
            expect(result.current.data).toEqual({
                [CurrencySymbol.ETH]: 8,
                [CurrencySymbol.WFIL]: 26,
                [CurrencySymbol.USDC]: 8,
                [CurrencySymbol.WBTC]: 8,
            })
        );
    });
});
