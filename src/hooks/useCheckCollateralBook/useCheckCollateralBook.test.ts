import { renderHook } from '@testing-library/react-hooks';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { useCheckCollateralBook } from './useCheckCollateralBook';

const mockSecuredFinance = mockUseSF();

jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('useCheckCollateralBook hook', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const account = '0x123';

    it('should return false when the user is null', () => {
        const { result } = renderHook(() => useCheckCollateralBook(null));
        const status = result.current;
        expect(status).toBe(false);
        expect(mockSecuredFinance.checkRegisteredUser).toHaveBeenCalledTimes(0);
    });

    it('should return false when secured finance sdk is not initialized', () => {
        mockSecuredFinance.checkRegisteredUser.mockReturnValue(undefined);
        const { result, waitFor } = renderHook(() =>
            useCheckCollateralBook(account)
        );
        const status = result.current;
        waitFor(() => expect(status).toBe(false));
    });

    it('should return false when the user is not registered', async () => {
        mockSecuredFinance.checkRegisteredUser.mockReturnValue(
            Promise.resolve(false)
        );
        const { result, waitFor, waitForNextUpdate } = renderHook(() =>
            useCheckCollateralBook(account)
        );
        const status = result.current;
        waitFor(() => expect(status).toBe(false));
        await waitForNextUpdate();
        expect(mockSecuredFinance.checkRegisteredUser).toHaveBeenCalled();
    });

    it('should return true when the user is registered', async () => {
        mockSecuredFinance.checkRegisteredUser.mockReturnValue(
            Promise.resolve(true)
        );
        const { result, waitFor, waitForNextUpdate } = renderHook(() =>
            useCheckCollateralBook(account)
        );
        const status = result.current;
        expect(status).toBe(false);
        waitFor(() => expect(status).toBe(true));
        await waitForNextUpdate();
        expect(mockSecuredFinance.checkRegisteredUser).toHaveBeenCalled();
    });
});
