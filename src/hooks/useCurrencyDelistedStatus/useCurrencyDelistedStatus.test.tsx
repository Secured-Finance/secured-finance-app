import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useCurrencyDelistedStatus } from './useCurrencyDelistedStatus';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useCurrencyDelistedStatus hook', () => {
    it('should return a map of currency symbol and their delisted status', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useCurrencyDelistedStatus()
        );

        await waitForNextUpdate();

        const delistedCurrencySet = new Set([CurrencySymbol.WFIL]);

        expect(mock.currencyExists).toHaveBeenCalledTimes(4);
        const newValue = result.current;
        expect(newValue.data).toEqual(delistedCurrencySet);
    });
});
