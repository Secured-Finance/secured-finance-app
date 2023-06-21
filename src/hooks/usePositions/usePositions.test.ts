import { BigNumber } from 'ethers';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { usePositions } from './usePositions';
import { ethBytes32, efilBytes32 } from 'src/stories/mocks/fixtures';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('usePositions', () => {
    it('should return an array of positions', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            usePositions('0x1')
        );

        expect(result.current).toEqual([]);

        await waitForNextUpdate();

        expect(result.current.length).toBe(4);
        expect(result.current[0].currency).toBe(ethBytes32);
        expect(result.current[1].currency).toBe(ethBytes32);
        expect(result.current[2].currency).toBe(efilBytes32);
        expect(result.current[3].currency).toBe(efilBytes32);
    });

    it('positions should have midPrice', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            usePositions('0x1')
        );
        await waitForNextUpdate();

        expect(result.current.length).toBe(4);
        expect(result.current[0].midPrice).toStrictEqual(BigNumber.from(9750));
        expect(result.current[1].midPrice).toStrictEqual(BigNumber.from(9500));
        expect(result.current[2].midPrice).toStrictEqual(BigNumber.from(9750));
        expect(result.current[3].midPrice).toStrictEqual(BigNumber.from(9500));
    });
});
