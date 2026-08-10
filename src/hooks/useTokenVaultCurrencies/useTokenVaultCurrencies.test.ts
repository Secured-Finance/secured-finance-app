import { wfilBytes32 } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useTokenVaultCurrencies } from './useTokenVaultCurrencies';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useTokenVaultCurrencies', () => {
    it('should return the currencies in which deposits exist', async () => {
        const { result } = renderHook(() => useTokenVaultCurrencies('0x1'));
        const value = result.current;
        expect(value.data).toEqual(undefined);
        expect(value.isPending).toEqual(true);

        await waitFor(() => {
            expect(mock.tokenVault.getUsedCurrencies).toHaveBeenCalledTimes(1);
            const newValue = result.current;
            expect(newValue.data).toHaveLength(1);
            expect(newValue.data[0]).toEqual(CurrencySymbol.WFIL);
            expect(newValue.isPending).toEqual(false);
        });
    });

    it('should return an empty array if no deposits exist', async () => {
        mock.tokenVault.getUsedCurrencies.mockResolvedValueOnce([]);
        const { result } = renderHook(() => useTokenVaultCurrencies('0x1'));

        await waitFor(() => expect(result.current.data).toHaveLength(0));
    });

    it('should return the CurrencySymbol associated to the bytes32', async () => {
        mock.tokenVault.getUsedCurrencies.mockResolvedValueOnce([
            wfilBytes32, // WFIL
        ]);

        const { result } = renderHook(() => useTokenVaultCurrencies('0x1'));

        await waitFor(() => {
            const newValue = result.current;
            expect(newValue.data).toHaveLength(1);
            expect(newValue.data[0]).toEqual(CurrencySymbol.WFIL);
        });
    });

    it('should remove values not recognized by CurrencySymbol', async () => {
        mock.tokenVault.getUsedCurrencies.mockResolvedValueOnce([
            wfilBytes32, // WFIL
            '0x1234', // unknown
        ]);
        const { result } = renderHook(() => useTokenVaultCurrencies('0x1'));

        await waitFor(() => {
            const newValue = result.current;
            expect(newValue.data).toHaveLength(1);
            expect(newValue.data[0]).toEqual(CurrencySymbol.WFIL);
        });
    });
});
