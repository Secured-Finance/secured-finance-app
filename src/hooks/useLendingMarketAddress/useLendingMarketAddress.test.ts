import { renderHook } from '@testing-library/react-hooks';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { useLendingMarketAddress } from './useLendingMarketAddress';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useLendingMarketAddress hook', () => {
    it('should return lending market address', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useLendingMarketAddress('ETH', '1 year')
        );
        expect(result.current).toEqual('');
        await waitForNextUpdate();
        expect(result.current).toEqual('0x0');
    });
});
