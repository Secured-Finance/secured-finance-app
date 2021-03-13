import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { UseWalletProvider } from 'use-wallet'
import ModalsProvider from './contexts/Modals'
import NavBar from './components/NavBar'
import ErrorBoundary from './components/ErrorBoundary'
import theme from './theme'
import Lending from './views/Lending'
import History from './views/History'
import Exchange from './views/Exchange'
import SecuredFinanceProvider from './contexts/SecuredFinanceProvider'
import Account from './views/Account'
import FilecoinWalletProvider from './contexts/FilecoinWalletProvider'
import Loan from './views/Loan'
import { PageNotFound } from './components/Page'

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Providers>
        <Router>
          <NavBar />
          <Switch>
            <Route path="/" exact>
              <Lending />
            </Route>
            <Route path="/exchange">
              <Exchange />
            </Route>
            <Route path="/history">
              <History />
            </Route>
            <Route path="/account">
              <Account />
            </Route>
            <Route path="/loan/:loanId">
              <Loan />
            </Route>
            <Route>
              <PageNotFound />
            </Route>
          </Switch>
        </Router>
      </Providers>
    </ErrorBoundary>
  )
}

const Providers: React.FC = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <UseWalletProvider
        chainId={0x539}
        connectors={{
          walletconnect: { rpcUrl: 'https://mainnet.eth.aragon.network/' },
        }}
      >
        <FilecoinWalletProvider>
          <SecuredFinanceProvider>
            <ModalsProvider>{children}</ModalsProvider>
          </SecuredFinanceProvider>
        </FilecoinWalletProvider>
      </UseWalletProvider>
    </ThemeProvider>
  )
}

export default App
