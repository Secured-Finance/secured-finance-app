/**
 * Feature flags for wagmi hook migration
 * Provides centralized feature flag management for gradual rollout
 */

import { Environment, getEnvironment, getWagmiHookFlag } from 'src/utils';

// Hook switcher utility for seamless migration
export const useHookSwitcher = <T>(
    legacyHook: () => T,
    wagmiHook: () => T
): T => {
    const useWagmi = getWagmiHookFlag();

    // Development logging to track feature flag usage (controlled by env var)
    if (
        getEnvironment() === Environment.DEVELOPMENT &&
        process.env.NEXT_PUBLIC_DEBUG_FEATURE_FLAGS === 'true'
    ) {
        // eslint-disable-next-line no-console
        console.log(
            `🔄 Using ${useWagmi ? 'wagmi' : 'legacy'} hook implementation`
        );
    }

    return useWagmi ? wagmiHook() : legacyHook();
};
