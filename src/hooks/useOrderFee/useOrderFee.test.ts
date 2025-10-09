import { mockUseLendingMarketControllerRead } from 'src/stories/mocks/wagmiMocks';
import { renderHook } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useOrderFee } from './useOrderFee';

beforeEach(() => {
    mockUseLendingMarketControllerRead.mockClear();
});

describe('useOrderFee hook', () => {
    it('should return the order fee for a currency', () => {
        const { result } = renderHook(() => useOrderFee(CurrencySymbol.WFIL));
        const value = result.current;

        // Wagmi implementation returns data immediately
        expect(value.data).toEqual(1); // 100 basis points / 100 = 1%
        expect(value.isPending).toEqual(false);
    });

    it('should divide by 100 the returned value', () => {
        // Setup custom mock value for this test
        mockUseLendingMarketControllerRead.mockReturnValueOnce({
            data: BigInt('50'),
            isLoading: false,
            error: null,
        });

        const { result } = renderHook(() => useOrderFee(CurrencySymbol.WFIL));
        const value = result.current;

        // Verify the fee calculation
        expect(value.data).toEqual(0.5); // 50 basis points / 100 = 0.5%
        expect(value.isPending).toEqual(false);
    });
});
