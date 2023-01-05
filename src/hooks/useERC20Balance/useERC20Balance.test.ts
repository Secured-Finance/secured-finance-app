import { SecuredFinanceClient } from '@secured-finance/sf-client';
import { renderHook } from '@testing-library/react-hooks';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { USDC } from 'src/utils/currencies/usdc';
import { useERC20Balance } from './useERC20Balance';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useLendingMarkets', () => {
    it('should insert the lending market contract into the store', async () => {
        const { result } = renderHook(() =>
            useERC20Balance(mock as unknown as SecuredFinanceClient)
        );
        const getBalance = result.current.getERC20Balance;
        await getBalance('0x0', USDC.onChain());

        expect(mock.getERC20Balance).toHaveBeenCalledWith(
            USDC.onChain(),
            '0x0'
        );
    });
});
