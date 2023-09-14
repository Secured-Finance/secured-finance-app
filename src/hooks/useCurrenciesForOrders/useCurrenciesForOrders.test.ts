import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useCurrenciesForOrders } from './useCurrenciesForOrders';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useCurrenciesForOrders', () => {
    it('should return the currencies in which an order exists', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useCurrenciesForOrders('0x1')
        );
        const value = result.current;
        expect(value.data).toEqual(undefined);
        expect(value.isLoading).toEqual(true);

        await waitForNextUpdate();

        expect(mock.getUsedCurrenciesForOrders).toHaveBeenCalledTimes(1);
        const newValue = result.current;
        expect(newValue.data).toHaveLength(2);
        expect(newValue.data[0]).toEqual(CurrencySymbol.ETH);
        expect(newValue.data[1]).toEqual(CurrencySymbol.WFIL);

        expect(newValue.isLoading).toEqual(false);
    });
});
