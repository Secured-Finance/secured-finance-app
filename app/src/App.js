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
  HashRouter as Router,
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
import { Loan_ABI, Loan_address } from './contracts/Loan';

import Box from '3box';
import ChatBox from '3box-chatbox-react';

import { createPow } from '@textile/powergate-client';

const PowerGate = createPow({ host: process.env.REACT_APP_POWERGATE_HOST });


console.log('PowerGate', PowerGate, process.env.REACT_APP_POWERGATE_HOST);
console.log('--------------------');
console.dir(PowerGate);
console.log('--------------------');

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

export const PGContext = React.createContext({
  pg: PowerGate,
  token: null,
  setTkn: () => {},
  address: null,
  setaddress: () => {},
});

function App() {
  const classes = useStyles();
  const web3Ref = useRef(null);
  const moneymarketContractRef = useRef(null);
  const fxContractRef = useRef(null);
  const loanContractRef = useRef(null);

  const [account, setaccount] = useState(null);
  const [box_instance, setbox] = useState(null);
  const [currentCurrency, setCurrentCurrency] = useState('1');
  const [token, settoken] = useState();
  const [address, setaddress] = useState();

  const [count, setcount] = useState(0);

  const setTkn = (tkn) => {
    settoken(tkn);
  };

  useEffect(() => {
    (async () => {
      let web3Provider;
      if (window.ethereum) {
        web3Provider = window.ethereum;
        try {
          // Request account access
          // await window.ethereum.enable();
          window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
          // User denied account access...
          console.error('User denied account access');
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

      loanContractRef.current = new web3Ref.current.eth.Contract(
        Loan_ABI,
        Loan_address,
      );
      // console.clear();
      // const x = await moneymarket.methods.getMidPrice.call()
      console.log('xxxx', fxContractRef.current.methods);
      // moneymarketContractRef.current.methods
      // .getMidRates()
      // .call()
      // .then((r) => console.log('xxxx', r)),

      console.dir(moneymarketContractRef.current);

      let box
      try {
        box = await Box.openBox(accounts[0],web3Provider);        
      } catch (error) {
        console.log("box err",error,accounts[0])        
      }


      web3Ref.current.eth.subscribe('newBlockHeaders', () => {
        setcount((c) => c + 1);
      });
      setaccount(accounts[0]);
      setbox(box);
    })();

    return () => {};
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <ContractContext.Provider
        value={{
          moneymarketContract: moneymarketContractRef.current,
          fxContract: fxContractRef.current,
          loanContract: loanContractRef.current,
          web3: web3Ref.current,
          account: account,
          currentCurrency,
        }}
      >
        <PGContext.Provider
          value={{
            pg: PowerGate,
            token: token,
            setTkn: setTkn,
            address: address,
            setaddress: (addr) => {
              setaddress(addr); //str
            },
          }}
        >
          <CssBaseline />
          <Router>
            <NavBar
              setCurrentCurrency={setCurrentCurrency}
              currentCurrency={currentCurrency}
            />

            <Switch>
              <Route path="/moneymkt">
                <MoneyMKT currentCurrency={currentCurrency} count={count} />
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
                <History count={count} />
              </Route>
              <Route path="*">
                <MoneyMKT />
              </Route>
            </Switch>
          </Router>
          {box_instance && (
            <ChatBox
              // required
              spaceName="mySpaceName"
              threadName="myThreadName"
              // Required props for context A) & B)
              box={box_instance}
              currentUserAddr={account}
              ethereum={window.ethereum}
              // optional
              mute={false}
              popupChat
              showEmoji
              colorTheme="#181F21"
            />
          )}
        </PGContext.Provider>
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
