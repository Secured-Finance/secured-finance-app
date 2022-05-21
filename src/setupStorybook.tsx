import React, { ReactNode } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { UseWalletProvider } from 'use-wallet';
import store from './store';
import theme from './theme';

type PayLoadsList = {
    payload: number;
    type: string;
};

export const StorybookProviders = ({
    children,
    dispatchFunctionList,
}: {
    children: ReactNode;
    dispatchFunctionList: Array<PayLoadsList>;
}) => {
    return (
        <UseWalletProvider
            connectors={{
                walletconnect: {
                    rpcUrl: 'https://ropsten.eth.aragon.network/',
                },
            }}
        >
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <PopulateStore dispatchList={dispatchFunctionList} />
                    <Router>{children}</Router>
                </ThemeProvider>
            </Provider>
        </UseWalletProvider>
    );
};

const PopulateStore = ({
    dispatchList,
}: {
    dispatchList: Array<PayLoadsList>;
}) => {
    const dispatch = useDispatch();
    dispatchList.forEach(dispatchFunction => dispatch(dispatchFunction));
    return <></>;
};
