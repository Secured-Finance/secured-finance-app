import { GraphClientProvider } from '@secured-finance/sf-graph-client';
import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Header } from 'src/components/organisms';
import { ThemeProvider } from 'styled-components';
import { UseWalletProvider } from 'use-wallet';
import FilecoinWalletProvider from './contexts/FilecoinWalletProvider';
import ModalsProvider from './contexts/Modals';
import SecuredFinanceProvider from './contexts/SecuredFinanceProvider';
import {
    useWatchEthereumUsdPrice,
    useWatchFilecoinUsdPrice,
} from './hooks/useAssetPrices';
import { useFilecoinWalletStore } from './hooks/useFilWallet';
import { FIL_ADDRESS, FIL_WALLET_TYPE } from './services/filecoin';
import theme from './theme';
import Account from './views/Account';
import Exchange from './views/Exchange';
import History from './views/History';
import Lending from './views/Lending';
import Loan from './views/Loan';

const App: React.FC = () => {
    const filAddr = localStorage.getItem(FIL_ADDRESS);
    const filWalletType = localStorage.getItem(FIL_WALLET_TYPE);

    useWatchEthereumUsdPrice();
    useWatchFilecoinUsdPrice();
    useFilecoinWalletStore(filAddr, filWalletType);

    return (
        <Router>
            <Providers>
                <Header />
                <Switch>
                    <Route path='/exchange'>
                        <Exchange />
                    </Route>
                    <Route path='/history'>
                        <History />
                    </Route>
                    <Route path='/account'>
                        <Account />
                    </Route>
                    <Route path='/loan/:loanId'>
                        <Loan />
                    </Route>
                    <Route path='/'>
                        <Lending />
                    </Route>
                </Switch>
            </Providers>
        </Router>
    );
};

const Providers: React.FC = ({ children }) => {
    return (
        <ThemeProvider theme={theme}>
            <GraphClientProvider>
                <UseWalletProvider
                    connectors={{
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

export default App;
