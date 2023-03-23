import { BigNumber } from 'ethers';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { useProtocolInformation } from './useProtocolInformation';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useProtocolInformation', () => {
    it('should return the correct protocol information', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useProtocolInformation()
        );

        expect(result.current).toEqual({
            totalNumberOfAsset: 0,
            valueLockedByCurrency: null,
        });

        await waitForNextUpdate();

        expect(result.current.totalNumberOfAsset).toBe(4);
        expect(result.current.valueLockedByCurrency).toEqual({
            ETH: BigNumber.from('100000000000000000000'), // 100 ETH
            EFIL: BigNumber.from('100000000000000000000000'), // 100 000 FIL
            USDC: BigNumber.from('1000000000000'), // 1 000 000 USDC
            WBTC: BigNumber.from('1000000000000'), // 1000 BTC
        });
    });
});
