import React from "react";
import { Grid, Paper, makeStyles } from "@material-ui/core";
import ApexChart from "./ApexChart";
import ReactVirtualizedTable from "./moneymkt/component/ReactVirtualizedTable";
import RateList from "../components/RateList/RateList";
import Actions from "../components/Actions";
import OrderBook from "../components/OrderBook";
import TradingViewWidget, { Themes } from "react-tradingview-widget";

const useStyles = makeStyles((theme) => ({
  gridItem: {
    padding: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(1),
  },
  midPrice: {
    padding: "20px 10px",
    textAlign: "center",
    border: "1px dotted white",
  },
}));

const asks = [];
const bids = [];

for (let index = 0; index < 7; index++) {
  asks.push({
    size: Math.round(Math.random() * 10000),
    rate: Math.round(Math.random() * 100),
  });

  bids.push({
    size: Math.round(Math.random() * 10000),
    rate: Math.round(Math.random() * 100),
  });
}

asks.sort((a, b) => a.rate - b.rate);
bids.sort((a, b) => b.rate - a.rate);

export default function Fx() {
  const classes = useStyles();

  return (
    <div className="fx-container">
      <div className="fx-left">
        <RateList></RateList>
      </div>
      <div className="fx-mid">
        <div className="fx-graph">
          <TradingViewWidget
            symbol="FILUSD"
            theme={Themes.DARK}
            locale="fr"
            autosize
          />
        </div>
        <Actions></Actions>
      </div>
      <div className="fx-right">
        <OrderBook></OrderBook>
      </div>
    </div>
  );
}
