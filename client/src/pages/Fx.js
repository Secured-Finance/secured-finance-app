import React from "react";
import { Grid, Paper, makeStyles } from "@material-ui/core";
import ApexChart from "./ApexChart";
import ReactVirtualizedTable from "./moneymkt/component/ReactVirtualizedTable";

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
          <YieldCurve></YieldCurve>
        </div>
        <Actions></Actions>
      </div>
      <div className="fx-right">
        <OrderBook></OrderBook>
      </div>
    </div>
  );
}
