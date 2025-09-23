import { toBytes32 } from '@secured-finance/sf-graph-client';
import * as jest from 'jest-mock';

// Generate bytes32 values using the same function as the rest of the codebase
// Cannot import from fixtures.ts due to circular dependency:
// setupTests.js → wagmiMocks.ts → fixtures.ts → utils → components → hooks → generated/wagmi
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

/**
 * Mock for useCurrencyControllerRead wagmi hook
 * Returns the same currency data as the legacy useSF mock
 */
export const mockUseCurrencyControllerRead = jest.fn(
    (params: WagmiHookParams = {}) => {
        if (params?.functionName === 'getCurrencies') {
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

        // Default return for other function calls
        return {
            data: undefined,
            isLoading: false,
            error: null,
        };
    }
);

/**
 * Mock for useLendingMarketControllerRead wagmi hook
 * Handles multiple functions within the LendingMarketController contract
 */
export const mockUseLendingMarketControllerRead = jest.fn(
    (params: WagmiHookParams = {}) => {
        if (params?.functionName === 'getOrderFeeRate') {
            return {
                data: BigInt('100'), // Default 1% fee rate (100 basis points)
                isLoading: false, // Wagmi v1 uses isLoading (TanStack Query v4)
                error: null,
            };
        }

        // Default return for other function calls
        return {
            data: undefined,
            isLoading: false,
            error: null,
        };
    }
);
