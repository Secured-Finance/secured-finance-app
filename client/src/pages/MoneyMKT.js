import React, { useEffect, useState, useContext } from "react";
import { Paper, Card, makeStyles, Grid } from "@material-ui/core";
import { Line } from "react-chartjs-2";
import Right from "./moneymkt/Right";
import { useRouteMatch, Redirect } from "react-router-dom";
import Axios from "axios";
import { ContractContext } from "../App";

import { Widget } from "react-chat-widget";
// import 'react-chat-widget/lib/styles.css';
import Createtokenx from "../slate/Createtokenx";
import FullScreenDialog from "./FullScreenDialog";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: "100%",
  },
  priceQuote: {
    textAlign: "center",
    marginTop: theme.spacing(2),
    fontSize: "1.5rem",
  },
  paper: {
    padding: theme.spacing(2),
  },
  gridClass: {
    padding: theme.spacing(2),
  },
  graph: {
    paddingTop: 100,
  },
  right: {
    paddingBottom: theme.spacing(4),
  },
}));

export default function MoneyMKT(props) {
  const { count } = props;
  const classes = useStyles();
  let x = useRouteMatch();
  const [res, setRes] = useState({});
  const contract = useContext(ContractContext);

  const [lenderRates, setlenderRates] = useState([]);
  const [borrowerRates, setborrowerRates] = useState([]);

  const [fileth, setfileth] = useState(0);

  const data = {
    labels: ["3m", "6m", "1y", "2y", "3y", "5y"],
    datasets: [
      {
        label: "Lend",
        fill: false,
        lineTension: 0.2,
        backgroundColor: "white",
        borderColor: "yellow",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "yellow",
        pointBackgroundColor: "white",
        pointBorderWidth: 1,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "yellow",
        pointHoverBorderWidth: 1.5,
        pointRadius: 1.7,
        pointHitRadius: 5,
        data: lenderRates.length
          ? lenderRates[contract.currentCurrency].map((r) => r / 100)
          : [],
        borderWidth: 0.5,
      },
      {
        label: "Borrow",
        fill: false,
        lineTension: 0.2,
        backgroundColor: "white",
        borderColor: "green",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "green",
        pointBackgroundColor: "white",
        pointBorderWidth: 1,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "green",
        pointHoverBorderWidth: 1.5,
        pointRadius: 1.7,
        pointHitRadius: 5,
        data: borrowerRates.length
          ? borrowerRates[contract.currentCurrency].map((r) => r / 100)
          : [],
        borderWidth: 0.5,
      },
    ],
  };

  useEffect(() => {
    Axios.get(
      "https://ipfs.io/ipfs/QmXDehr8oXPNQ6ixNvrge1ay5PTW9mJMRbYtNaV1Bbgzu6"
    ).then((res) => {
      setRes(res.data);
    });

    return () => {};
  }, []);

  useEffect(() => {
    console.log("ratess");
    (async () => {
      if (contract.moneymarketContract) {
        const lr = await contract.moneymarketContract.methods
          .getLenderRates()
          .call();
        const br = await contract.moneymarketContract.methods
          .getBorrowerRates()
          .call();

        setlenderRates(lr);
        setborrowerRates(br);

        console.log("ratess", lr, br);
      }

      if (contract.fxContract) {
        const fileth = await contract.fxContract.methods.getMidRates().call();
        setfileth(parseInt(fileth[0]) / 1000);
        console.log("fileth", fileth);
      }
    })();
    return () => {};
  }, [count, contract]);

  console.log("res", res);

  return (
    <div style={{ position: "relative" }}>
      <Grid container spacing={3} className={classes.gridClass}>
        <Redirect to="/moneymkt/3m" />

        <Grid item xs={8} align="center">
          <Paper className={classes.paper}>
            <Line data={data} />
          </Paper>
          <Paper className={classes.paper} style={{ marginTop: 8 }}>
            <div className={classes.priceQuote}>
              1 FIL = {`${fileth ? fileth : ".."} ETH`}
            </div>
          </Paper>
          <Paper className={classes.paper} style={{ marginTop: 8 }}>
            <div>
              <FullScreenDialog></FullScreenDialog>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={4} className={classes.ok}>
          <Paper className={classes.right}>
            <Right res={res} />
          </Paper>
        </Grid>
      </Grid>
      <div style={{ position: "absolute", left: 0 }}>{/* <Widget /> */}</div>
    </div>
  );
}
