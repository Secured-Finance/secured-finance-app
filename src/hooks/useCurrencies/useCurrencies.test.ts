import { ethBytes32, ifilBytes32 } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import {
    mockWagmiCurrencies,
    resetWagmiMock,
} from 'src/stories/mocks/wagmiMocks';
import { renderHook, waitFor } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useCurrencies } from './useCurrencies';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useCurrencies', () => {
    beforeEach(() => {
        resetWagmiMock();
    });

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
        // Mock for legacy implementation
        mock.getCurrencies.mockResolvedValueOnce([ethBytes32, ifilBytes32]);
        // Mock for wagmi implementation
        mockWagmiCurrencies([ethBytes32, ifilBytes32]);

        const { result } = renderHook(() => useCurrencies(true));
        await waitFor(() =>
            expect(result.current.data).toEqual([
                CurrencySymbol.ETH,
                CurrencySymbol.iFIL,
            ])
        );
    });

    it('should filter out currencies that are not supported', async () => {
        // Mock for legacy implementation
        mock.getCurrencies.mockResolvedValueOnce([ethBytes32, '0x0']);
        // Mock for wagmi implementation
        mockWagmiCurrencies([ethBytes32, '0x0']);

        const { result } = renderHook(() => useCurrencies());
        await waitFor(() =>
            expect(result.current.data).toEqual([CurrencySymbol.ETH])
        );
    });
});
