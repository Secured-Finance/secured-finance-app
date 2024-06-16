import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook, waitFor } from 'src/test-utils';
import { ZERO_BI } from 'src/utils';
import { useTotalValueLockedAndCurrencies } from './useTotalValueLockedAndCurrencies';

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

afterEach(() => {
    mockSecuredFinance.getCurrencies.mockClear();
    mockSecuredFinance.getCollateralCurrencies.mockClear();
});

describe('useTotalValueLockedAndCurrencies', () => {
    it('should return the total value locked', async () => {
        const { result } = renderHook(() => useTotalValueLockedAndCurrencies());
        const value = result.current;
        expect(value.totalValueLockedInUSD).toEqual(ZERO_BI);

        await waitFor(() => {
            expect(mockSecuredFinance.getCurrencies).toHaveBeenCalledTimes(1);
            expect(
                mockSecuredFinance.getCollateralCurrencies
            ).toHaveBeenCalledTimes(1);
            expect(
                mockSecuredFinance.getProtocolDepositAmount
            ).toHaveBeenCalledTimes(1);
            expect(mockSecuredFinance.getLastPrice).toHaveBeenCalledTimes(4);
            const newValue = result.current;
            expect(newValue.totalValueLockedInUSD).toEqual(BigInt(501800034));
        });
    });

    it('should return an array of currencies used for calculating the total value locked', async () => {
        const { result } = renderHook(() => useTotalValueLockedAndCurrencies());
        const value = result.current;
        expect(value.currencies).toEqual([]);

        await waitFor(() => {
            expect(mockSecuredFinance.getCurrencies).toHaveBeenCalledTimes(1);
            expect(
                mockSecuredFinance.getCollateralCurrencies
            ).toHaveBeenCalledTimes(1);
            const newValue = result.current;
            expect(newValue.currencies).toHaveLength(4);
        });
    });
});
