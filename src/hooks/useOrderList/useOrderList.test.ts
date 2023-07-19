import { ethBytes32, wfilBytes32 } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { useOrderList } from './useOrderList';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useOrderList', () => {
    it('should return a sorted array of activeOrders and inactiveOrders by creation date', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useOrderList('0x1')
        );

        expect(result.current).toEqual({
            activeOrderList: [],
            inactiveOrderList: [],
        });

        await waitForNextUpdate();

        expect(result.current.activeOrderList.length).toBe(5);
        for (let i = 0; i < result.current.activeOrderList.length - 1; i++) {
            expect(
                result.current.activeOrderList[i].createdAt.toNumber()
            ).toBeGreaterThanOrEqual(
                result.current.activeOrderList[i + 1].createdAt.toNumber()
            );
        }

        expect(result.current.inactiveOrderList.length).toBe(2);
        expect(result.current.inactiveOrderList[0].currency).toBe(ethBytes32);
        expect(result.current.inactiveOrderList[1].currency).toBe(wfilBytes32);
    });
});
