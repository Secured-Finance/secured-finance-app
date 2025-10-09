import { toBytes32 } from '@secured-finance/sf-graph-client';
import * as jest from 'jest-mock';

// Generate bytes32 values using the same function as the rest of the codebase
// Cannot import from fixtures.ts due to circular dependency:
// setupTests.js → wagmiMocks.ts → fixtures.ts → utils → components → hooks → generated/wagmi
const ZERO_BI = BigInt(0);
const ethBytes32 = toBytes32('ETH');
const wfilBytes32 = toBytes32('WFIL');
const wbtcBytes32 = toBytes32('WBTC');
const usdcBytes32 = toBytes32('USDC');

// State to track mocked return values
let mockedCurrencies: string[] | null = null;

/**
 * Set specific currencies to return from the wagmi mock
 * This allows tests to override the default behavior
 */
export const mockWagmiCurrencies = (currencies: string[]) => {
    mockedCurrencies = currencies;
};

/**
 * Reset wagmi mock to default behavior
 */
export const resetWagmiMock = () => {
    mockedCurrencies = null;
};

// Type definition for wagmi hook parameters
interface WagmiHookParams {
    functionName?: string;
    [key: string]: unknown;
}

function generateOrderbook(depth: number) {
    const unitPrices = [
        BigInt(9690),
        BigInt(9687),
        BigInt(9685),
        BigInt(9679),
        BigInt(9674),
    ];

    const zeros = Array(depth - unitPrices.length).fill(BigInt(0));

    const amounts = [
        BigInt('43000000000000000000000'),
        BigInt('23000000000000000000000'),
        BigInt('15000000000000000000000'),
        BigInt('12000000000000000000000'),
        BigInt('1800000000000000000000'),
    ];

    const quantities = [
        BigInt('1000'),
        BigInt('2000'),
        BigInt('3000'),
        BigInt('4000'),
        BigInt('5000'),
    ];

    // Return as tuple to match wagmi contract return type
    return [
        [...unitPrices, ...zeros],
        [...amounts, ...zeros],
        [...quantities, ...zeros],
        ZERO_BI,
    ] as const;
}

/**
 * Mock for useCurrencyControllerRead wagmi hook
 * Returns the same currency data as the legacy useSF mock
 */
export const mockUseCurrencyControllerRead = jest.fn(
    (params: WagmiHookParams = {}) => {
        const functionName = params?.functionName;

        switch (functionName) {
            case 'getCurrencies': {
                const defaultCurrencies = [
                    ethBytes32,
                    wfilBytes32,
                    wbtcBytes32,
                    usdcBytes32,
                ];
                return {
                    data: mockedCurrencies || defaultCurrencies,
                    isLoading: false,
                    error: null,
                };
            }
            default:
                return {
                    data: undefined,
                    isLoading: false,
                    error: null,
                };
        }
    }
);

/**
 * Mock for useLendingMarketControllerRead wagmi hook
 * Handles multiple functions within the LendingMarketController contract
 */
export const mockUseLendingMarketControllerRead = jest.fn(
    (params: WagmiHookParams = {}) => {
        const functionName = params?.functionName;

        switch (functionName) {
            case 'getOrderFeeRate':
                return {
                    data: BigInt('100'), // Default 1% fee rate (100 basis points)
                    isLoading: false, // Wagmi v1 uses isLoading (TanStack Query v4)
                    error: null,
                };
            default:
                return {
                    data: undefined,
                    isLoading: false,
                    error: null,
                };
        }
    }
);

/**
 * Mock for useLendingMarketReaderGetBorrowOrderBook wagmi hook
 * Returns mock orderbook data for borrow orders
 */
export const mockUseLendingMarketReaderRead = jest.fn(
    (params: WagmiHookParams = {}) => {
        const functionName = params?.functionName;

        switch (functionName) {
            case 'getBorrowOrderBook': {
                const args = params?.args as unknown[];
                const depth = args && args[3] ? Number(args[3]) : 15;
                return {
                    data: generateOrderbook(depth),
                    isLoading: false,
                    error: null,
                };
            }
            case 'getLendOrderBook': {
                const args = params?.args as unknown[];
                const depth = args && args[3] ? Number(args[3]) : 15;
                return {
                    data: generateOrderbook(depth),
                    isLoading: false,
                    error: null,
                };
            }
            default:
                return {
                    data: undefined,
                    isLoading: false,
                    error: null,
                };
        }
    }
);
