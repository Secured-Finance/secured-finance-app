import { ethBytes32, ifilBytes32 } from 'src/stories/mocks/fixtures';
import {
    mockUseCurrencyControllerRead,
    mockWagmiCurrencies,
    resetWagmiMock,
} from 'src/stories/mocks/wagmiMocks';
import { renderHook, waitFor } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useCurrencies } from './useCurrencies';

describe('useCurrencies', () => {
    beforeEach(() => {
        resetWagmiMock();
        mockUseCurrencyControllerRead.mockClear();
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
        // Mock wagmi implementation with specific currencies
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
        // Mock wagmi implementation with unsupported currency
        mockWagmiCurrencies([ethBytes32, '0x0']);

        const { result } = renderHook(() => useCurrencies());
        await waitFor(() =>
            expect(result.current.data).toEqual([CurrencySymbol.ETH])
        );
    });
});
