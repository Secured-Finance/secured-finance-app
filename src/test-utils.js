import { configureStore } from '@reduxjs/toolkit';
import { render as rtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { rootReducers } from 'src/store';

function render(
    ui,
    {
        initialState,
        store = configureStore({ reducer: rootReducers, initialState }),
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
    return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

export * from '@testing-library/react';
export { render };
