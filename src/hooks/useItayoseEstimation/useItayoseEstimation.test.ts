import { dec22Fixture } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useItayoseEstimation } from './useItayoseEstimation';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useItayoseEstimation', () => {
    it('should return the itayose estimation values', async () => {
        const { result } = renderHook(() =>
            useItayoseEstimation(CurrencySymbol.WFIL, dec22Fixture.toNumber())
        );
        expect(result.current.isLoading).toEqual(true);

        await waitFor(() => {
            expect(result.current.isLoading).toEqual(false);
            expect(result.current.data).toEqual({
                openingUnitPrice: BigInt(9970),
                lastLendUnitPrice: BigInt(9975),
                lastBorrowUnitPrice: BigInt(9970),
                totalOffsetAmount: BigInt(40000000),
            });
        });
    });
});
