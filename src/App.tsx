import React, { useEffect, useRef } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client/react';
import { ThemeProvider } from 'styled-components';
import { useWallet, UseWalletProvider } from 'use-wallet';
import ModalsProvider from './contexts/Modals';
import NavBar from './components/NavBar';
import theme from './theme';
import Lending from './views/Lending';
import History from './views/History';
import Exchange from './views/Exchange';
import SecuredFinanceProvider from './contexts/SecuredFinanceProvider';
import Account from './views/Account';
import FilecoinWalletProvider from './contexts/FilecoinWalletProvider';
import Loan from './views/Loan';
import { client } from './services/apollo';

const App: React.FC = () => {
    return (
        <Providers>
            <Router>
                <NavBar />
                <Switch>
                    <Route path='/' exact>
                        <Lending />
                    </Route>
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
                </Switch>
            </Router>
        </Providers>
    );
};

const Providers: React.FC = ({ children }) => {
    return (
        <ThemeProvider theme={theme}>
            <ApolloProvider client={client}>
                <UseWalletProvider
                    chainId={3}
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
            </ApolloProvider>
        </ThemeProvider>
    );
};

export default App;
