import React, { useEffect } from 'react';
import {
    useBlockchainStore,
    useLandingOrderFormStore,
    useLastErrorStore,
    useUIStore,
    useWalletStore,
} from '../src/store';
import { initialStore } from '../src/stories/mocks/mockStore';

/**
 * Component that initializes Zustand stores with mock data for Storybook
 * This ensures all stories start with consistent, predictable state
 */
export const StoreInitializer = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    useEffect(() => {
        // Initialize blockchain store
        useBlockchainStore.setState(initialStore.blockchain);

        // Initialize wallet store
        useWalletStore.setState(initialStore.wallet);

        // Initialize UI store
        useUIStore.setState(initialStore.ui);

        // Initialize landing order form store
        useLandingOrderFormStore.setState(initialStore.landingOrderForm);

        // Initialize last error store
        useLastErrorStore.setState(initialStore.lastError);
    }, []);

    return <>{children}</>;
};
