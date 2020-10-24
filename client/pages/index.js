import Head from "next/head";
import Link from "next/link";
import React, { Fragment, useEffect, useState, useRef } from "react";
import { Button, Container } from "@material-ui/core";
import Authereum from "authereum";
import UniLogin from "@unilogin/provider";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import {
  createMuiTheme,
  ThemeProvider,
  makeStyles,
} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import Web3 from "web3";
import MoneyMarketContract from "../contracts/MoneyMarket";
import FxMarketContract from "../contracts/FXMarket";
import LoanContract from "../contracts/Loan";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

// import Navbar from '../components/NavBar/NavBar';

export default function Home(props) {
  console.log('pro',props);
  return (
    <Fragment>
      <Head>
        <title>ASd</title>
      </Head>
      <div> PropTypes.df.eired</div>
    </Fragment>
  );
}
