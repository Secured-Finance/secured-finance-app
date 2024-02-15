import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useTerminationPrices } from './useTerminationPrices';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useTerminationPrices hook', () => {
    it('should a map with the prices of all tokens', async () => {
        const { result } = renderHook(() => useTerminationPrices());
        expect(result.current.data).toEqual(undefined);

        await waitFor(() =>
            expect(result.current.data).toEqual({
                [CurrencySymbol.ETH]: 1577.71480752,
                [CurrencySymbol.USDC]: 1.0,
                [CurrencySymbol.WBTC]: 25577.71480752,
                [CurrencySymbol.WFIL]: 3.204525549022934,
            })
        );
    });
});
