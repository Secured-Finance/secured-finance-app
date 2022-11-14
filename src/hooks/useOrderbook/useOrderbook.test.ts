import { BigNumber } from 'ethers';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useOrderbook } from './useOrderbook';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useOrderbook', () => {
    it('should return an array of number for borrow rates', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useOrderbook(CurrencySymbol.ETH, 1, 1)
        );

        expect(result.current).toEqual({
            borrowOrderbook: [],
            lendOrderbook: [],
        });

        await waitForNextUpdate();

        result.current.borrowOrderbook.rates.forEach((rate: unknown) =>
            expect(rate).toBeInstanceOf(BigNumber)
        );

        result.current.borrowOrderbook.amounts.forEach((rate: unknown) =>
            expect(rate).toBeInstanceOf(BigNumber)
        );
    });
});
