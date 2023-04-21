import { SecuredFinanceClient } from '@secured-finance/sf-client';
import { renderHook } from '@testing-library/react-hooks';
import { dec22Fixture } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { CurrencySymbol } from 'src/utils';
import { useMarket } from './useMarket';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useMarket', () => {
    it('return the a object describing the market and its state', async () => {
        const { result, waitForNextUpdate, waitFor } = renderHook(() =>
            useMarket(
                CurrencySymbol.EFIL,
                dec22Fixture,
                mock as unknown as SecuredFinanceClient
            )
        );
        await waitFor(() => expect(result).not.toBeNull());
        await waitForNextUpdate();
        expect(result.current).toEqual({
            ccy: CurrencySymbol.EFIL,
            maturity: dec22Fixture,
            isItayosePeriod: false,
            isOpened: true,
            isPreOrderPeriod: false,
        });
    });
});
