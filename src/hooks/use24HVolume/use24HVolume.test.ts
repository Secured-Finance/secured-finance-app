import { mockTransactions24H } from 'src/stories/mocks/queries';
import { renderHook, waitFor } from 'src/test-utils';
import { currencyMap } from 'src/utils';
import { useGraphClientHook } from '../useGraphClientHook';
import { use24HVolume } from './use24HVolume';

jest.mock('../useGraphClientHook', () => ({
    useGraphClientHook: jest.fn(),
}));

const mockedUseGraphClientHook = useGraphClientHook as jest.Mock;

describe('use24HVolume', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return empty data when no transactions', () => {
        mockedUseGraphClientHook.mockReturnValue({ data: null });

        const { result } = renderHook(() => use24HVolume());

        expect(result.current.data).toEqual({});
    });

    it('should correctly process mock transaction data', async () => {
        mockedUseGraphClientHook.mockReturnValue({
            data: { transactions: mockTransactions24H },
        });

        const { result } = renderHook(() => use24HVolume());

        const expectedKey = `WFIL-${mockTransactions24H[0].maturity}`;
        const expectedValue = currencyMap.WFIL.fromBaseUnit(BigInt('5000000'));

        await waitFor(() => {
            expect(result.current.data[expectedKey]).toBe(expectedValue);
        });
    });
});
