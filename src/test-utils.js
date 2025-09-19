import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
    render as rtlRender,
    renderHook as rtlRenderHook,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { rootReducers } from 'src/store';
import { connector, publicClient } from 'src/stories/mocks/mockWallet';
import { WagmiConfig, createConfig } from 'wagmi';
import { initialStore } from './stories/mocks/mockStore';
import {
    setupGraphQLMocks,
    cleanupGraphQLMocks,
} from './test-utils/graphqlMocks';
import './test-utils/mockPointsClient'; // Import points client mocks

const defaultOptions = { defaultOptions: { queries: { retry: false } } };

/**
 *
 * @param {*} ui
 * @param {*} param1
 * @returns
 */
function render(
    ui,
    {
        preloadedState = initialStore,
        store = configureStore({
            reducer: rootReducers,
            preloadedState,
            middleware: getDefaultMiddleware =>
                getDefaultMiddleware({
                    serializableCheck: false,
                }),
        }),
        graphqlMocks = null,
        ...renderOptions
    } = {}
) {
    // Setup GraphQL mocks if provided
    if (graphqlMocks) {
        setupGraphQLMocks(graphqlMocks);
    }

    function Wrapper({ children }) {
        const queryClient = new QueryClient(defaultOptions);
        return (
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <WagmiConfig
                        config={createConfig({
                            publicClient: publicClient,
                            connectors: [connector],
                        })}
                    >
                        {children}
                    </WagmiConfig>
                </QueryClientProvider>
            </Provider>
        );
    }
    return { store, ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }) };
}

/**
 *
 * @param {*} ui
 * @param {*} param1
 * @returns
 */
function renderHook(
    hook,
    {
        preloadedState = initialStore,
        store = configureStore({
            reducer: rootReducers,
            preloadedState,
            middleware: getDefaultMiddleware =>
                getDefaultMiddleware({
                    serializableCheck: false,
                }),
        }),
        graphqlMocks = null,
        ...renderOptions
    } = {}
) {
    // Setup GraphQL mocks if provided
    if (graphqlMocks) {
        setupGraphQLMocks(graphqlMocks);
    }

    function Wrapper({ children }) {
        const queryClient = new QueryClient(defaultOptions);
        return (
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <WagmiConfig
                        config={createConfig({
                            publicClient: publicClient,
                            connectors: [connector],
                        })}
                    >
                        {children}
                    </WagmiConfig>
                </QueryClientProvider>
            </Provider>
        );
    }
    return {
        store,
        ...rtlRenderHook(hook, { wrapper: Wrapper, ...renderOptions }),
    };
}

export * from '@testing-library/react';
export { render, renderHook, setupGraphQLMocks, cleanupGraphQLMocks };
