import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Button, Container } from '@material-ui/core';
import NavBar from './NavBar';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  createMuiTheme,
  ThemeProvider,
  makeStyles,
} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import MoneyMKT from './pages/MoneyMKT';
import Swap from './pages/Swap';
import Fx from './pages/Fx';
import Book from './pages/Book';
import History from './pages/History';
import Web3 from 'web3';
import { MoneyMarket_address, MoneyMarket_ABI } from './contracts/MoneyMarket';
import { Fx_ABI, Fx_address } from './contracts/Fx';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
  },
}));

const tabs = ['MoneyMKT', 'Swap', 'FX', 'Book', 'History'];

const routes = tabs.map((t) => t.toLowerCase());

export const ContractContext = React.createContext(null);
const FxContext = React.createContext(null);

function App() {
  const classes = useStyles();
  const [account, setaccount] = useState(null);
  const web3Ref = useRef(null);
  const moneymarketContractRef = useRef(null);
  const fxContractRef = useRef(null);

  const [count, setcount] = useState(0);

  useEffect(() => {
    (async () => {
      let web3Provider
      if (window.ethereum) {
        web3Provider = window.ethereum;
        try {
          // Request account access
          // await window.ethereum.enable();
          window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
          // User denied account access...
          console.error("User denied account access")
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        web3Provider = window.web3.currentProvider;
      }
      // If no injected web3 instance is detected, fall back to Ganache
      else {
        web3Provider = new Web3.providers.HttpProvider('http://localhost:9545');
      }
     
      web3Ref.current = new Web3(web3Provider); //Web3.givenProvider || "http://localhost:9545"
      const accounts = await web3Ref.current.eth.getAccounts();
      // setaccount(accounts[0]);
      web3Ref.current.eth.defaultAccount =
        '0xdC4B87B1b7a3cCFb5d9e85C09a59923C0F6cdAFc';
      moneymarketContractRef.current = new web3Ref.current.eth.Contract(
        MoneyMarket_ABI,
        MoneyMarket_address,
      );

      fxContractRef.current = new web3Ref.current.eth.Contract(
        Fx_ABI,
        Fx_address,
      );
      // console.clear();
      // const x = await moneymarket.methods.getMidPrice.call()
      console.log(
        'xxxx',
        fxContractRef.current.methods,      
      );
      // moneymarketContractRef.current.methods
      // .getMidRates()
      // .call()
      // .then((r) => console.log('xxxx', r)),

      console.dir(moneymarketContractRef.current);

      setcount((c) => c + 1);
    })();

    return () => {};
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <ContractContext.Provider
        value={{
          moneymarketContract: moneymarketContractRef.current,
          fxContract: fxContractRef.current,
          web3: web3Ref.current,
        }}
      >
        <CssBaseline />
        <Router>
          <NavBar />

          <Switch>
            <Route path="/moneymkt">
              <MoneyMKT />
            </Route>
            <Route path="/swap">
              <Swap />
            </Route>
            <Route path="/fx">
              <Fx />
            </Route>
            <Route path="/book">
              <Book />
            </Route>
            <Route path="/history">
              <History />
            </Route>
            <Route path="*">
              <MoneyMKT />
            </Route>
          </Switch>
        </Router>
      </ContractContext.Provider>
    </ThemeProvider>
  );
}

export default App;

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}
