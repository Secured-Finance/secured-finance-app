import { configureStore } from '@reduxjs/toolkit';
import { render as rtlRender } from '@testing-library/react';
import { renderHook as rtlRenderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { rootReducers } from 'src/store';

function render(
    ui,
    {
        initialState,
        store = configureStore({
            reducer: rootReducers,
            initialState,
            middleware: getDefaultMiddleware =>
                getDefaultMiddleware({
                    serializableCheck: false,
                }),
        }),
        ...renderOptions
    } = {}
) {
    function Wrapper({ children }) {
        return (
            <HashRouter>
                <Provider store={store}>{children}</Provider>
            </HashRouter>
        );
    }
    return { store, ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }) };
}

function renderHook(
    hook,
    {
        initialState,
        store = configureStore({
            reducer: rootReducers,
            initialState,
            middleware: getDefaultMiddleware =>
                getDefaultMiddleware({
                    serializableCheck: false,
                }),
        }),
        ...renderOptions
    } = {}
) {
    function Wrapper({ children }) {
        return (
            <HashRouter>
                <Provider store={store}>{children}</Provider>
            </HashRouter>
        );
    }
    return {
        store,
        ...rtlRenderHook(hook, { wrapper: Wrapper, ...renderOptions }),
    };
}

export * from '@testing-library/react';
export { render, renderHook };
