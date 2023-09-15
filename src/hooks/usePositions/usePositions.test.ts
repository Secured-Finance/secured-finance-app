import { BigNumber } from 'ethers';
import { ethBytes32, wfilBytes32 } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { usePositions } from './usePositions';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

const usedCurrencies = [CurrencySymbol.ETH, CurrencySymbol.WFIL];

describe('usePositions', () => {
    it('should return an array of positions', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            usePositions('0x1', usedCurrencies)
        );

        const value = result.current;
        expect(value.data).toEqual(undefined);
        expect(value.isLoading).toEqual(true);

        await waitForNextUpdate();
        expect(mock.getPositions).toHaveBeenCalledTimes(1);

        const newValue = result.current;
        expect(newValue.data).toHaveLength(4);
        expect(newValue.data[0].currency).toBe(ethBytes32);
        expect(newValue.data[1].currency).toBe(ethBytes32);
        expect(newValue.data[2].currency).toBe(wfilBytes32);
        expect(newValue.data[3].currency).toBe(wfilBytes32);
        expect(newValue.isLoading).toEqual(false);
    });

    it('positions should have midPrice', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            usePositions('0x1', usedCurrencies)
        );
        await waitForNextUpdate();

        const newValue = result.current;
        expect(newValue.data).toHaveLength(4);
        expect(newValue.data[0].midPrice).toStrictEqual(BigNumber.from(9750));
        expect(newValue.data[1].midPrice).toStrictEqual(BigNumber.from(9500));
        expect(newValue.data[2].midPrice).toStrictEqual(BigNumber.from(9750));
        expect(newValue.data[3].midPrice).toStrictEqual(BigNumber.from(9500));
    });
});
