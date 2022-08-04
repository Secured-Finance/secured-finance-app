import { GraphClientProvider } from '@secured-finance/sf-graph-client';
import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { UseWalletProvider } from 'use-wallet';
import { Header } from './components/organisms';
import { Landing } from './components/pages';
import { Layout } from './components/templates';
import FilecoinWalletProvider from './contexts/FilecoinWalletProvider';
import ModalsProvider from './contexts/Modals';
import SecuredFinanceProvider from './contexts/SecuredFinanceProvider';
import store from './store';
import theme from './theme';
import { setUpSecuredFinanceSkd } from './utils';
import Account from './views/Account';
import Exchange from './views/Exchange';
import History from './views/History';
import Loan from './views/Loan';

const routes = [
    {
        path: '/exchange',
        component: <Exchange />,
    },
    {
        path: '/history',
        component: <History />,
    },
    {
        path: '/account',
        component: <Account />,
    },
    {
        path: '/loan/:loanId',
        component: <Loan />,
    },
    {
        path: '/',
        component: <Landing />,
    },
];

const SecuredFinanceApp: React.FC = () => {
    return (
        <Provider store={store}>
            <Router>
                <Providers>
                    <Layout routes={routes} navBar={<Header />} />
                </Providers>
            </Router>
        </Provider>
    );
};

const Providers: React.FC = ({ children }) => {
    const network = setUpSecuredFinanceSkd();
    return (
        <ThemeProvider theme={theme}>
            <GraphClientProvider network={network}>
                <UseWalletProvider
                    connectors={{
                        injected: {
                            chainId: [4],
                        },
                        walletconnect: {
                            rpcUrl: 'https://ropsten.eth.aragon.network/',
                        },
                    }}
                >
                    <FilecoinWalletProvider>
                        <SecuredFinanceProvider>
                            <ModalsProvider>{children}</ModalsProvider>
                        </SecuredFinanceProvider>
                    </FilecoinWalletProvider>
                </UseWalletProvider>
            </GraphClientProvider>
        </ThemeProvider>
    );
};

export default SecuredFinanceApp;
