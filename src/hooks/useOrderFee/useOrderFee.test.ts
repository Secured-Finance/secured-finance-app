import { BigNumber } from 'ethers';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { act, renderHook } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useOrderFee } from './useOrderFee';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useOrderFee hook', () => {
    it('should return the order fee for a currency', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useOrderFee(CurrencySymbol.EFIL)
        );
        await act(async () => {
            await waitForNextUpdate();
        });
        const fee = result.current as BigNumber;
        expect(fee).toEqual(1);
    });
});
