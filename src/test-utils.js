import { MockedProvider } from '@apollo/client/testing';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render as rtlRender } from '@testing-library/react';
import { renderHook as rtlRenderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { rootReducers } from 'src/store';
import { initialStore } from './stories/mocks/mockStore';

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
        apolloMocks = null,
        ...renderOptions
    } = {}
) {
    function Wrapper({ children }) {
        const queryClient = new QueryClient(defaultOptions);
        const component = (
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </Provider>
        );

        if (apolloMocks) {
            return (
                <MockedProvider mocks={apolloMocks}>{component}</MockedProvider>
            );
        }
        return component;
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
        ...renderOptions
    } = {}
) {
    function Wrapper({ children }) {
        const queryClient = new QueryClient(defaultOptions);
        return (
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    {children}
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
export { render, renderHook };
