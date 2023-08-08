import { BigNumber } from 'ethers';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import {
    useTotalNumberOfAsset,
    useValueLockedByCurrency,
} from './useProtocolInformation';

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

describe('useValueLockedByCurrency', () => {
    it('should return the order fee for a currency', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useValueLockedByCurrency()
        );
        const value = result.current;
        expect(value.data).toEqual(undefined);
        expect(value.isLoading).toEqual(true);

        await waitForNextUpdate();

        expect(mock.getProtocolDepositAmount).toHaveBeenCalledTimes(1);
        const newValue = result.current;
        expect(newValue.data).toEqual({
            ETH: BigNumber.from('100000000000000000000'), // 100 ETH
            WFIL: BigNumber.from('100000000000000000000000'), // 100 000 FIL
            USDC: BigNumber.from('1000000000000'), // 1 000 000 USDC
            WBTC: BigNumber.from('1000000000000'), // 1000 BTC
        });
        expect(newValue.isLoading).toEqual(false);
    });
});
