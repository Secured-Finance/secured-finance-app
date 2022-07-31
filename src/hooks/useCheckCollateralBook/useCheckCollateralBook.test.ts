import { renderHook } from '@testing-library/react-hooks';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { useCheckCollateralBook } from './useCheckCollateralBook';

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('useCheckCollateralBook hook', () => {
    it('should return false when the user is null', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useCheckCollateralBook(null)
        );
        expect(result.current).toBe(false);
        await waitForNextUpdate();
        expect(mockSecuredFinance.checkRegisteredUser).toHaveBeenCalledWith('');
    });

    it('should return true when the user is registered', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useCheckCollateralBook('0x123')
        );
        expect(result.current).toBe(false);
        await waitForNextUpdate();
        expect(result.current).toBe(true);
    });
});
