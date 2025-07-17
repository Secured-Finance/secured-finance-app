import { renderHook } from 'src/test-utils';
import { use24HVolume } from './use24HVolume';
import { useGraphClientHook } from '../useGraphClientHook';
import { mockTransactions24H } from 'src/stories/mocks/queries';
import { currencyMap } from 'src/utils';

jest.mock('../useGraphClientHook', () => ({
    useGraphClientHook: jest.fn(),
}));

const mockedUseGraphClientHook = useGraphClientHook as jest.Mock;

describe('use24HVolume', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return empty data when no transactions and log a warning', () => {
        mockedUseGraphClientHook.mockReturnValue({ data: null });

        const { result } = renderHook(() => use24HVolume());

        expect(result.current.data).toEqual({});
    });

    it('should correctly process mock transaction data', () => {
        mockedUseGraphClientHook.mockReturnValue({
            data: { transactions: mockTransactions24H },
        });

        const { result } = renderHook(() => use24HVolume());

        const expectedKey = 'WFIL-1751587200';
        const expectedValue = currencyMap.WFIL.fromBaseUnit(BigInt('5000000'));

        expect(result.current.data[expectedKey]).toBe(expectedValue);
    });
});
