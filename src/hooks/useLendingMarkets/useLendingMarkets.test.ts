import { renderHook } from '@testing-library/react-hooks';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { CurrencySymbol } from 'src/utils';
import { useLendingMarkets } from './useLendingMarkets';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useLendingMarkets', () => {
    it('should return the lending markets for a given currency', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useLendingMarkets(CurrencySymbol.ETH)
        );

        await waitForNextUpdate();
        expect(result.current).toEqual({
            'ETH-1000': {
                ccy: CurrencySymbol.ETH,
                maturity: 1000,
                name: 'ETH-1000',
            },
            'ETH-2000': {
                ccy: CurrencySymbol.ETH,
                maturity: 2000,
                name: 'ETH-2000',
            },
        });
    });
});
