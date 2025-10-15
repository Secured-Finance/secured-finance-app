import { MockedProvider } from '@apollo/client/testing';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
    render as rtlRender,
    renderHook as rtlRenderHook,
} from '@testing-library/react';
import {
    useBlockchainStore,
    useLandingOrderFormStore,
    useLastErrorStore,
    useUIStore,
    useWalletStore,
} from 'src/store';
import { connector, publicClient } from 'src/stories/mocks/mockWallet';
import { WagmiConfig, createConfig } from 'wagmi';
import { initialStore } from './stories/mocks/mockStore';

const defaultQueryClientOptions = {
    defaultOptions: { queries: { retry: false } },
};

const stores = {
    blockchain: useBlockchainStore,
    wallet: useWalletStore,
    landingOrderForm: useLandingOrderFormStore,
    lastError: useLastErrorStore,
    ui: useUIStore,
};

function initializeAllStores(preloadedState) {
    preloadedState = preloadedState || {};

    Object.entries(stores).forEach(([key, store]) => {
        const state = Object.assign(
            {},
            initialStore[key],
            preloadedState[key] || {}
        );
        const actions = Object.fromEntries(
            Object.entries(store.getState()).filter(
                ([_, v]) => typeof v === 'function'
            )
        );
        store.setState(Object.assign({}, state, actions), true);
    });

    return {
        getState: () =>
            Object.fromEntries(
                Object.entries(stores).map(([key, store]) => [
                    key,
                    store.getState(),
                ])
            ),
    };
}

function createWrapper(apolloMocks) {
    return function Wrapper({ children }) {
        const queryClient = new QueryClient(defaultQueryClientOptions);

        const content = (
            <QueryClientProvider client={queryClient}>
                <WagmiConfig
                    config={createConfig({
                        publicClient,
                        connectors: [connector],
                    })}
                >
                    {children}
                </WagmiConfig>
            </QueryClientProvider>
        );

        return apolloMocks ? (
            <MockedProvider mocks={apolloMocks} addTypename={false}>
                {content}
            </MockedProvider>
        ) : (
            content
        );
    };
}

/**
 * Custom render function that works exactly like Redux - complete store initialization
 * @param {*} ui React component to render
 * @param {*} options Render options including preloadedState
 * @returns Render result with store mock for Redux compatibility
 */

function render(
    ui,
    { preloadedState, apolloMocks = null, ...renderOptions } = {}
) {
    const store = initializeAllStores(preloadedState || initialStore);
    return {
        store,
        ...rtlRender(ui, {
            wrapper: createWrapper(apolloMocks),
            ...renderOptions,
        }),
    };
}

function renderHook(
    hook,
    { preloadedState = initialStore, apolloMocks = null, ...renderOptions } = {}
) {
    const store = initializeAllStores(preloadedState);
    return {
        store,
        ...rtlRenderHook(hook, {
            wrapper: createWrapper(apolloMocks),
            ...renderOptions,
        }),
    };
}

export * from '@testing-library/react';
export { render, renderHook };
