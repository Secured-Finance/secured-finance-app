import { configureStore } from '@reduxjs/toolkit';
import { render as rtlRender } from '@testing-library/react';
import { renderHook as rtlRenderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { rootReducers } from 'src/store';

function render(
    ui,
    {
        preloadedState = {},
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
        return <Provider store={store}>{children}</Provider>;
    }
    return { store, ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }) };
}

function renderHook(
    hook,
    {
        preloadedState = {},
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
        return <Provider store={store}>{children}</Provider>;
    }
    return {
        store,
        ...rtlRenderHook(hook, { wrapper: Wrapper, ...renderOptions }),
    };
}

export * from '@testing-library/react';
export { render, renderHook };
