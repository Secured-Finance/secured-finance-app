import React, { Fragment, useEffect, useState, useRef } from "react";
import { Button, Container } from "@material-ui/core";
import NavBar from "./components/NavBar";
import Authereum from "authereum";
import UniLogin from "@unilogin/provider";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import {
  createMuiTheme,
  ThemeProvider,
  makeStyles,
} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import MoneyMKT from "./pages/MoneyMKT";
import Swap from "./pages/Swap";
import Fx from "./pages/Fx";
import Book from "./pages/Book";
import History from "./pages/History";
import Web3 from "web3";
import MoneyMarketContract from "./contracts/MoneyMarket";
import FxMarketContract from "./contracts/FXMarket";
import LoanContract from "./contracts/Loan";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

import { createPow } from "@textile/powergate-client";

const PowerGate = createPow({ host: process.env.REACT_APP_POWERGATE_HOST });

console.log("PowerGate", PowerGate, process.env.REACT_APP_POWERGATE_HOST);
console.log("--------------------");
console.dir(PowerGate);
console.log("--------------------");

const theme = createMuiTheme({
  palette: {
    type: "dark",

    background: {
      default: "#0f1a22",
      paper: "#172734",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
  },
}));

const tabs = ["MoneyMKT", "Swap", "FX", "Book", "History"];

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

function initWeb3(provider) {
  const web3 = new Web3(provider);

  web3.eth.extend({
    methods: [
      {
        name: "chainId",
        call: "eth_chainId",
        outputFormatter: web3.utils.hexToNumber,
      },
    ],
  });

  return web3;
}

function App() {
  const classes = useStyles();
  const web3Ref = useRef(null);
  const moneymarketContractRef = useRef(null);
  const fxContractRef = useRef(null);
  const loanContractRef = useRef(null);
  const web3ModalRef = useRef(null);

  const [account, setaccount] = useState(null);
  const [currentCurrency, setCurrentCurrency] = useState("1");
  const [token, settoken] = useState();
  const [address, setaddress] = useState();

  const [count, setcount] = useState(0);

  const setTkn = (tkn) => {
    settoken(tkn);
  };

  const resetApp = async () => {
    const web3 = web3Ref.current;
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    await web3ModalRef.current.clearCachedProvider();
    //reset
  };

  const subscribeProvider = async (provider) => {
    if (!provider.on) {
      return;
    }
    provider.on("close", () => resetApp());
  };

  const onConnect = async () => {
    // debugger
    const provider = await web3ModalRef.current.connect();

    await subscribeProvider(provider);

    web3Ref.current = new Web3(provider);

    console.log("accounts", web3Ref.current);
    const accounts = await web3Ref.current.eth.getAccounts();

    const curr_account = accounts[0];
    console.log("address", curr_account);

    const networkId = await web3Ref.current.eth.net.getId();
    const deployedNetwork_moneyMarket = MoneyMarketContract.networks[networkId];
    const deployedNetwork_fxMarket = FxMarketContract.networks[networkId];
    const deployedNetwork_loan = LoanContract.networks[networkId];

    moneymarketContractRef.current = new web3Ref.current.eth.Contract(
      MoneyMarketContract.abi,
      deployedNetwork_moneyMarket && deployedNetwork_moneyMarket.address
    );

    fxContractRef.current = new web3Ref.current.eth.Contract(
      FxMarketContract.abi,
      deployedNetwork_fxMarket && deployedNetwork_fxMarket.address
    );

    loanContractRef.current = new web3Ref.current.eth.Contract(
      LoanContract.abi,
      deployedNetwork_loan && deployedNetwork_loan.address
    );

    web3Ref.current.eth.subscribe("newBlockHeaders", () => {
      setcount((c) => c + 1);
    });

    setaccount(curr_account);
  };

  useEffect(() => {
    (async () => {
      web3ModalRef.current = new Web3Modal({
        cacheProvider: true, // optional
        providerOptions: {
          authereum: {
            package: Authereum, // required
          },
          unilogin: {
            package: UniLogin, // required
          },
          walletconnect: {
            package: WalletConnectProvider, // required
            options: {
              infuraId: process.env.REACT_APP_INFURA_ID, // required
            },
          },
        },
        theme: "dark",
      });
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
              onConnect={onConnect}
              account={account}
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
        </PGContext.Provider>
      </ContractContext.Provider>
    </ThemeProvider>
  );
}

export default App;
