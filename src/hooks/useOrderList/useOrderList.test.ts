import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { useOrderList } from './useOrderList';
import {
    ethBytes32,
    efilBytes32,
    wbtcBytes32,
} from 'src/stories/mocks/fixtures';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useOrderList', () => {
    it('should return a sorted array of activeOrders and inactiveOrders', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useOrderList('0x1')
        );

        expect(result.current).toEqual({
            activeOrderList: [],
            inactiveOrderList: [],
        });

        await waitForNextUpdate();

        expect(result.current.activeOrderList.length).toBe(4);
        expect(result.current.activeOrderList[0].currency).toBe(ethBytes32);
        expect(result.current.activeOrderList[1].currency).toBe(wbtcBytes32);
        expect(result.current.activeOrderList[2].currency).toBe(ethBytes32);
        expect(result.current.activeOrderList[3].currency).toBe(efilBytes32);

        expect(result.current.inactiveOrderList.length).toBe(2);
        expect(result.current.inactiveOrderList[0].currency).toBe(ethBytes32);
        expect(result.current.inactiveOrderList[1].currency).toBe(efilBytes32);
    });
});
