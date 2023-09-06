import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { useTotalNumberOfAsset } from './useTotalNumberOfAsset';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useTotalNumberOfAsset', () => {
    it('should return the order fee for a currency', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useTotalNumberOfAsset()
        );
        const value = result.current;
        expect(value.data).toEqual(undefined);
        expect(value.isLoading).toEqual(true);

        await waitForNextUpdate();

        expect(mock.getCurrencies).toHaveBeenCalledTimes(1);
        const newValue = result.current;
        expect(newValue.data).toEqual(4);
        expect(newValue.isLoading).toEqual(false);
    });
});
