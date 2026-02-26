import { ethBytes32, ifilBytes32 } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import * as envUtils from 'src/utils/env';
import { useCurrencies } from './useCurrencies';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);
jest.mock('src/utils/env', () => ({
    ...jest.requireActual('src/utils/env'),
    getDelistedCurrencies: jest.fn(() => []),
}));

describe('useCurrencies', () => {
    const mockGetDelistedCurrencies =
        envUtils.getDelistedCurrencies as jest.MockedFunction<
            typeof envUtils.getDelistedCurrencies
        >;

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

    it('should merge delisted currencies from environment variables', async () => {
        mockGetDelistedCurrencies.mockReturnValue(['WFIL']);

        mock.getCurrencies.mockResolvedValueOnce([ethBytes32]);
        const { result } = renderHook(() => useCurrencies());
        await waitFor(() =>
            expect(result.current.data).toEqual([
                CurrencySymbol.ETH,
                CurrencySymbol.WFIL,
            ])
        );
    });

    it('should remove duplicates when delisted currency is also in active currencies', async () => {
        mockGetDelistedCurrencies.mockReturnValue(['ETH']);

        mock.getCurrencies.mockResolvedValueOnce([ethBytes32]);
        const { result } = renderHook(() => useCurrencies());
        await waitFor(() => {
            expect(result.current.data).toEqual([CurrencySymbol.ETH]);
            // Should only contain ETH once, not twice
            expect(result.current.data?.length).toBe(1);
        });
    });

    it('should filter delisted currencies by hasOrderBook when showAll is false', async () => {
        mockGetDelistedCurrencies.mockReturnValue(['WFIL', 'iFIL']);

        mock.getCurrencies.mockResolvedValueOnce([ethBytes32]);
        const { result } = renderHook(() => useCurrencies(false));
        await waitFor(() => {
            // WFIL has orderBook, iFIL does not
            expect(result.current.data).toEqual([
                CurrencySymbol.ETH,
                CurrencySymbol.WFIL,
            ]);
        });
    });

    it('should include all delisted currencies when showAll is true', async () => {
        mockGetDelistedCurrencies.mockReturnValue(['WFIL', 'iFIL']);

        mock.getCurrencies.mockResolvedValueOnce([ethBytes32]);
        const { result } = renderHook(() => useCurrencies(true));
        await waitFor(() => {
            expect(result.current.data).toEqual([
                CurrencySymbol.ETH,
                CurrencySymbol.WFIL,
                CurrencySymbol.iFIL,
            ]);
        });
    });
});
