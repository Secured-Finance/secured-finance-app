import { Transaction } from 'src/components/organisms';
import { renderHook } from 'src/test-utils';
import { HistoricalDataIntervals } from 'src/types';
import {
    getPreviousTimestamp,
    getSnappedTimestamp,
    useTransactionCandleStickData,
} from './useTransactionCandleStickData';
import { wfilBytes32 } from 'src/stories/mocks/fixtures';

// Mock the specific functions we need
jest.mock('src/utils', () => ({
    ...jest.requireActual('src/utils'),
    hexToCurrencySymbol: jest.fn().mockReturnValue('ETH'),
    amountFormatterFromBase: {
        ETH: jest.fn((value: bigint) => Number(value) / 1e18),
    },
}));

const createMockTransaction = (
    timestamp: string,
    open: string,
    high: string,
    low: string,
    close: string,
    volume: string
): Transaction => ({
    timestamp,
    open,
    high,
    low,
    close,
    volume,
    currency: wfilBytes32,
    average: '3',
    interval: '86400',
    maturity: '1725397600',
    volumeInFV: '3',
});

describe('useTransactionCandleStickData', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should process transaction data and fill missing hour gap', () => {
        jest.spyOn(Date, 'now').mockReturnValue(1625101200000);
        const mockTransactions: Transaction[] = [
            createMockTransaction(
                '1625097600', // newer
                '200000',
                '210000',
                '190000',
                '205000',
                '1000000000000000000'
            ),
            createMockTransaction(
                '1625090400', // older
                '195000',
                '205000',
                '185000',
                '200000',
                '2000000000000000000'
            ),
        ];

        const { result } = renderHook(() =>
            useTransactionCandleStickData(
                { data: { transactionCandleSticks: mockTransactions } },
                HistoricalDataIntervals['1H']
            )
        );

        expect(result.current).toEqual([
            {
                time: '1625090400',
                open: 1950,
                high: 2050,
                low: 1850,
                close: 2000,
                vol: 2,
            },
            {
                time: '1625094000',
                open: 2050,
                high: 2050,
                low: 2050,
                close: 2050,
                vol: 0,
            },
            {
                time: '1625097600',
                open: 2000,
                high: 2100,
                low: 1900,
                close: 2050,
                vol: 1,
            },
        ]);

        jest.spyOn(Date, 'now').mockRestore();
    });

    it.each([
        [
            'WEEK',
            HistoricalDataIntervals['1W'],
            [
                createMockTransaction(
                    '1704888000', // Jan 10 (newest)
                    '210000',
                    '220000',
                    '200000',
                    '215000',
                    '1500000000000000000'
                ),
                createMockTransaction(
                    '1704286800', // Jan 3 13:00
                    '205000',
                    '215000',
                    '195000',
                    '210000',
                    '2000000000000000000'
                ),
                createMockTransaction(
                    '1704283200', // Jan 3 12:00 (oldest)
                    '200000',
                    '210000',
                    '190000',
                    '205000',
                    '1000000000000000000'
                ),
            ],
            1705000000000,
            '1704067200',
            { open: 2000, high: 2150, low: 1900, close: 2100, vol: 3 },
        ],
        [
            'MONTH',
            HistoricalDataIntervals['1MTH'],
            [
                createMockTransaction(
                    '1707091200', // Feb 5 (newest)
                    '210000',
                    '220000',
                    '200000',
                    '215000',
                    '1500000000000000000'
                ),
                createMockTransaction(
                    '1705708800', // Jan 20
                    '205000',
                    '215000',
                    '195000',
                    '210000',
                    '2000000000000000000'
                ),
                createMockTransaction(
                    '1705276800', // Jan 15 (oldest)
                    '200000',
                    '210000',
                    '190000',
                    '205000',
                    '1000000000000000000'
                ),
            ],
            1708000000000,
            '1704067200',
            { open: 2000, high: 2150, low: 1900, close: 2100, vol: 3 },
        ],
    ])(
        'should aggregate transactions by %s (snapped to boundary)',
        (_, interval, transactions, mockNow, expectedTime, expected) => {
            jest.spyOn(Date, 'now').mockReturnValue(mockNow);
            const { result } = renderHook(() =>
                useTransactionCandleStickData(
                    { data: { transactionCandleSticks: transactions } },
                    interval
                )
            );

            const aggregated = result.current.find(
                (item: { time: string }) => item.time === expectedTime
            );
            expect(aggregated).toBeDefined();
            expect(aggregated?.open).toBe(expected.open);
            expect(aggregated?.high).toBe(expected.high);
            expect(aggregated?.low).toBe(expected.low);
            expect(aggregated?.close).toBe(expected.close);
            expect(aggregated?.vol).toBe(expected.vol);

            jest.spyOn(Date, 'now').mockRestore();
        }
    );
});

describe('getSnappedTimestamp', () => {
    it.each([
        [1704283200, 604800, 1704067200, 'WEEK: Wednesday -> Monday'],
        [1704636000, 604800, 1704067200, 'WEEK: Sunday -> Monday'],
        [1705320000, 2592000, 1704067200, 'MONTH: Jan 15 -> Jan 1'],
        [1708008000, 2592000, 1706745600, 'MONTH: Feb 15 -> Feb 1'],
        [1625097600, 3600, 1625097600, 'Regular: exact match'],
        [1625097650, 3600, 1625097600, 'Regular: snap down'],
    ])('should snap timestamp - %s', (timestamp, interval, expected) => {
        expect(getSnappedTimestamp(timestamp, interval)).toBe(expected);
    });
});

describe('getPreviousTimestamp', () => {
    it.each([
        [1706745600, 2592000, 1704067200, 'MONTH: Feb -> Jan'],
        [1625097600, 3600, 1625094000, 'Regular: 1H'],
        [1625097600, 604800, 1624492800, 'Regular: 1W'],
    ])('should subtract interval - %s', (timestamp, interval, expected) => {
        expect(getPreviousTimestamp(timestamp, interval)).toBe(expected);
    });
});
