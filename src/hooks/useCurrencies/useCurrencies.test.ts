import { ethBytes32, ifilBytes32 } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useCurrencies } from './useCurrencies';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useCurrencies', () => {
    it('should return the list of currencies that have an order book in order', async () => {
        const { result } = renderHook(() => useCurrencies());
        await waitFor(() =>
            expect(result.current.data).toEqual([
                CurrencySymbol.WBTC,
                CurrencySymbol.ETH,
                CurrencySymbol.WFIL,
                CurrencySymbol.USDC,
            ])
        );
    });

    it('should return the list of all supported currencies in order', async () => {
        mock.getCurrencies.mockResolvedValueOnce([ethBytes32, ifilBytes32]);
        const { result } = renderHook(() => useCurrencies(true));
        await waitFor(() =>
            expect(result.current.data).toEqual([
                CurrencySymbol.ETH,
                CurrencySymbol.iFIL,
            ])
        );
    });

    it('should filter out currencies that are not supported', async () => {
        mock.getCurrencies.mockResolvedValueOnce([ethBytes32, '0x0']);
        const { result } = renderHook(() => useCurrencies());
        await waitFor(() =>
            expect(result.current.data).toEqual([CurrencySymbol.ETH])
        );
    });
});
