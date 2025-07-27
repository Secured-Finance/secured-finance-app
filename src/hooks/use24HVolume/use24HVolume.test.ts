import { mockTransactions24H } from 'src/stories/mocks/queries';
import { renderHook, waitFor } from 'src/test-utils';
import { currencyMap } from 'src/utils';
import { useGraphClientHook } from '../useGraphClientHook';
import { use24HVolume } from './use24HVolume';
import {
    currencyList,
    usdcBytes32,
    wfilBytes32,
} from 'src/stories/mocks/fixtures';

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

    it('should NOT aggregate when only 1000 txs and pagination is expected', async () => {
        const bulkMockTxs = Array.from({ length: 1000 }).map((_, i) => ({
            ...mockTransactions24H[0],
            createdAt: mockTransactions24H[0].createdAt + i,
        }));

        mockedUseGraphClientHook.mockReturnValue({
            data: { transactions: bulkMockTxs },
        });

        const { result } = renderHook(() => use24HVolume());
        const expectedKey = `${currencyList[0].value}-${mockTransactions24H[0].maturity}`;

        await waitFor(() => {
            expect(result.current.data[expectedKey]).toBeUndefined();
        });
    });

    it('should compute > 1000 txs across currencies/maturities', async () => {
        const wfilTxs = Array.from({ length: 1000 }).map((_, i) => ({
            amount: '1000000',
            maturity: 1710000000,
            createdAt: 1709990000 + i,
            currency: wfilBytes32,
            averagePrice: '1',
            executionPrice: '1',
            __typename: 'Transaction',
        }));

        const usdcTxs = Array.from({ length: 50 }).map((_, i) => ({
            amount: '2000000',
            maturity: 1710003600,
            createdAt: 1710000000 + i,
            currency: usdcBytes32,
            averagePrice: '1',
            executionPrice: '1',
            __typename: 'Transaction',
        }));

        const allTransactions = [...wfilTxs, ...usdcTxs];

        mockedUseGraphClientHook.mockReturnValue({
            data: { transactions: allTransactions },
        });

        const { result } = renderHook(() => use24HVolume());

        await waitFor(() => {
            expect(Object.keys(result.current.data).length).toBe(2);
        });

        const expectedWFILKey = `${currencyList[2].value}-1710000000`;
        const expectedUSDCKey = `${currencyList[3].value}-1710003600`;

        const expectedWFILAmount =
            currencyMap.WFIL.fromBaseUnit(BigInt(1000000)) * 1000;

        const expectedUSDCAmount =
            currencyMap.USDC.fromBaseUnit(BigInt(2000000)) * 50;

        expect(result.current.data[expectedWFILKey]).toBeCloseTo(
            expectedWFILAmount,
            12
        );
        expect(result.current.data[expectedUSDCKey]).toBeCloseTo(
            expectedUSDCAmount,
            12
        );
    });
});
