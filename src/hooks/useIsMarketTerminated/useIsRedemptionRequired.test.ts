import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { useIsRedemptionRequired } from './useIsRedemptionRequired';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

const user = '0x123';

beforeEach(() => mock.isRedemptionRequired.mockClear());

describe('useIsRedemptionRequired hook', () => {
    it('should return true if the user needs to perform a redemption action', async () => {
        mock.isRedemptionRequired.mockResolvedValueOnce(true);
        const { result } = renderHook(() => useIsRedemptionRequired(user));

        await waitFor(() => {
            expect(mock.isRedemptionRequired).toHaveBeenCalledTimes(1);
            expect(result.current.data).toEqual(true);
        });
    });

    it('should return false if the user does not need to perform a redemption action', async () => {
        mock.isRedemptionRequired.mockResolvedValueOnce(false);
        const { result } = renderHook(() => useIsRedemptionRequired(user));

        await waitFor(() => {
            expect(mock.isRedemptionRequired).toHaveBeenCalledTimes(1);
            expect(result.current.data).toEqual(false);
        });
    });

    it('should return false if the user is not defined', async () => {
        mock.isRedemptionRequired.mockResolvedValueOnce(false);
        const { result } = renderHook(() => useIsRedemptionRequired(undefined));
        expect(mock.isRedemptionRequired).toHaveBeenCalledTimes(0);
        expect(result.current.data).toEqual(false);
    });
});
