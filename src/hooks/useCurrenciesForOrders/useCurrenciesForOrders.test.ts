import { wfilBytes32 } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useCurrenciesForOrders } from './useCurrenciesForOrders';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useCurrenciesForOrders', () => {
    it('should return the currencies in which an order exists', async () => {
        const { result } = renderHook(() => useCurrenciesForOrders('0x1'));
        const value = result.current;
        expect(value.data).toEqual(undefined);
        expect(value.isLoading).toEqual(true);

        await waitFor(() => {
            expect(mock.getUsedCurrenciesForOrders).toHaveBeenCalledTimes(1);
            const newValue = result.current;
            expect(newValue.data).toHaveLength(4);
            expect(newValue.data[0]).toEqual(CurrencySymbol.ETH);
            expect(newValue.data[1]).toEqual(CurrencySymbol.WFIL);
            expect(newValue.data[2]).toEqual(CurrencySymbol.WBTC);
            expect(newValue.data[3]).toEqual(CurrencySymbol.USDC);

            expect(newValue.isLoading).toEqual(false);
        });
    });

    it('should return an empty array if no orders exist', async () => {
        mock.getUsedCurrenciesForOrders.mockResolvedValueOnce([]);
        const { result } = renderHook(() => useCurrenciesForOrders('0x1'));

        await waitFor(() => expect(result.current.data).toHaveLength(0));
    });

    it('should return the CurrencySymbol associated to the bytes32', async () => {
        mock.getUsedCurrenciesForOrders.mockResolvedValueOnce([
            wfilBytes32, // WFIL
        ]);

        const { result } = renderHook(() => useCurrenciesForOrders('0x1'));

        await waitFor(() => {
            const newValue = result.current;
            expect(newValue.data).toHaveLength(1);
            expect(newValue.data[0]).toEqual(CurrencySymbol.WFIL);
        });
    });

    it('should remove values not recognized by CurrencySymbol', async () => {
        mock.getUsedCurrenciesForOrders.mockResolvedValueOnce([
            wfilBytes32, // WFIL
            '0x1234', // unknown
        ]);
        const { result } = renderHook(() => useCurrenciesForOrders('0x1'));

        await waitFor(() => {
            const newValue = result.current;
            expect(newValue.data).toHaveLength(1);
            expect(newValue.data[0]).toEqual(CurrencySymbol.WFIL);
        });
    });
});
