import { GraphClientProvider } from '@secured-finance/sf-graph-client';
import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import { UseWalletProvider } from 'use-wallet';
import { Header } from './components/organisms';
import { Landing, PortfolioManagement } from './components/pages';
import { Layout } from './components/templates';
import SecuredFinanceProvider from './contexts/SecuredFinanceProvider';
import store from './store';
import { setUpSecuredFinanceSkd } from './utils';

const routes = [
    {
        path: '/exchange',
        component: <div data-cy='exchange-page'>exchange</div>,
    },
    {
        path: '/history',
        component: <PortfolioManagement />,
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
    );
};

export default SecuredFinanceApp;
