import {
    ethBytes32,
    ifilBytes32,
    wfilBytes32,
} from 'src/stories/mocks/fixtures';
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
                CurrencySymbol.USDC,
                CurrencySymbol.ETH,
                CurrencySymbol.WBTC,
                CurrencySymbol.WFIL,
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

    it('should merge token vault currencies', async () => {
        mock.tokenVault.getUsedCurrencies.mockResolvedValueOnce([wfilBytes32]);
        mock.getCurrencies.mockResolvedValueOnce([ethBytes32]);

        const { result } = renderHook(() =>
            useCurrencies(true, undefined, '0x123')
        );
        await waitFor(() =>
            expect(result.current.data).toEqual([
                CurrencySymbol.ETH,
                CurrencySymbol.WFIL,
            ])
        );
    });

    it('should remove duplicates when delisted currency is also in active currencies', async () => {
        mock.tokenVault.getUsedCurrencies.mockResolvedValueOnce([ethBytes32]);
        mock.getCurrencies.mockResolvedValueOnce([ethBytes32]);

        const { result } = renderHook(() =>
            useCurrencies(true, undefined, '0x123')
        );
        await waitFor(() => {
            expect(result.current.data).toEqual([CurrencySymbol.ETH]);
            // Should only contain ETH once, not twice
            expect(result.current.data?.length).toBe(1);
        });
    });

    it('should filter delisted currencies by hasOrderBook when showAll is false', async () => {
        mock.tokenVault.getUsedCurrencies.mockResolvedValueOnce([
            wfilBytes32,
            ifilBytes32,
        ]);
        mock.getCurrencies.mockResolvedValueOnce([ethBytes32]);

        const { result } = renderHook(() =>
            useCurrencies(false, undefined, '0x123')
        );
        await waitFor(() => {
            // WFIL has orderBook, iFIL does not
            expect(result.current.data).toEqual([
                CurrencySymbol.ETH,
                CurrencySymbol.WFIL,
            ]);
        });
    });

    it('should include all delisted currencies when showAll is true', async () => {
        mock.tokenVault.getUsedCurrencies.mockResolvedValueOnce([
            wfilBytes32,
            ifilBytes32,
        ]);
        mock.getCurrencies.mockResolvedValueOnce([ethBytes32]);

        const { result } = renderHook(() =>
            useCurrencies(true, undefined, '0x123')
        );
        await waitFor(() => {
            expect(result.current.data).toEqual([
                CurrencySymbol.ETH,
                CurrencySymbol.WFIL,
                CurrencySymbol.iFIL,
            ]);
        });
    });
});
