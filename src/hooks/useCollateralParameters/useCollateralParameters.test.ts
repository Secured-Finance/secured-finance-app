import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { useCollateralParameters } from './useCollateralParameters';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useCollateralParameters', () => {
    it('should call getCollateralParameters and return the appropriate value', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useCollateralParameters()
        );

        expect(mock.getCollateralParameters).toHaveBeenCalled();
        await waitForNextUpdate();
        expect(result.current).toEqual(80);
    });
});
