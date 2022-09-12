import { GraphClientProvider } from '@secured-finance/sf-graph-client';
import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { UseWalletProvider } from 'use-wallet';
import { Header } from './components/organisms';
import { Landing, PortfolioManagement } from './components/pages';
import { Layout } from './components/templates';
import SecuredFinanceProvider from './contexts/SecuredFinanceProvider';
import store from './store';
import theme from './theme';
import { setUpSecuredFinanceSkd } from './utils';
import Exchange from './views/Exchange';
import Loan from './views/Loan';

const routes = [
    {
        path: '/exchange',
        component: <Exchange />,
    },
    {
        path: '/history',
        component: <PortfolioManagement />,
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
                    <SecuredFinanceProvider>{children}</SecuredFinanceProvider>
                </UseWalletProvider>
            </GraphClientProvider>
        </ThemeProvider>
    );
};

export default SecuredFinanceApp;
