import { renderHook } from '@testing-library/react-hooks';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { currencyMap, CurrencySymbol } from 'src/utils';
import { useCrosschainAddressByChainId } from './useCrosschainAddress';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useCrosschainAddress hook', () => {
    it.only('should return lending market address', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useCrosschainAddressByChainId('0x0', CurrencySymbol.FIL)
        );
        expect(result.current).toEqual('');
        await waitForNextUpdate();
        expect(mock.getCrosschainAddress).toHaveBeenCalledWith(
            currencyMap.FIL.chainId,
            '0x0'
        );
        expect(result.current).toEqual('fil0x0');
    });
});
