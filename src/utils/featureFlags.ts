/**
 * Feature flags for wagmi hook migration
 * Provides centralized feature flag management for gradual rollout
 */

import { Environment, getEnvironment, getWagmiHookFlag } from 'src/utils';

// Supported hook names for feature flags
export type WagmiHookName =
    | 'currencies'
    | 'balances'
    | 'orderbook'
    | 'orders'
    | 'positions'
    | 'markets'
    | 'collateral'
    | 'genesis'
    | 'decimals'
    | 'lastPrices';

// Hook switcher utility for seamless migration
export const useHookSwitcher = <T>(
    hookName: WagmiHookName,
    legacyHook: () => T,
    wagmiHook: () => T
): T => {
    const useWagmi = getWagmiHookFlag(hookName);

    // Development logging to track feature flag usage (controlled by env var)
    if (
        getEnvironment() === Environment.DEVELOPMENT &&
        process.env.NEXT_PUBLIC_DEBUG_FEATURE_FLAGS === 'true'
    ) {
        // eslint-disable-next-line no-console
        console.log(
            `🔄 Hook ${hookName}: using ${
                useWagmi ? 'wagmi' : 'legacy'
            } implementation`
        );
    }

    return useWagmi ? wagmiHook() : legacyHook();
};
