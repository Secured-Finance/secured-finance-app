import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import {
    defaultDelistedStatusMap,
    useCurrencyDelistedStatus,
} from './useCurrencyDelistedStatus';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

beforeEach(() => mock.getOrderFeeRate.mockClear());

describe('useCurrencyDelistedStatus hook', () => {
    it('should return a map of currency symbol and their delisted status', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useCurrencyDelistedStatus()
        );

        await waitForNextUpdate();

        expect(mock.currencyExists).toHaveBeenCalledTimes(4);
        const newValue = result.current;
        expect(newValue.data).toEqual({
            ...defaultDelistedStatusMap,
            [CurrencySymbol.WFIL]: true,
        });
    });
});
