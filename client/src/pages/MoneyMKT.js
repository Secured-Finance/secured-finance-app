import React, { useEffect, useState, useContext } from "react";
import { Paper, Card, makeStyles, Grid, Button } from "@material-ui/core";
import { Line, defaults } from "react-chartjs-2";
import Right from "./moneymkt/Right";
import { useRouteMatch, Redirect } from "react-router-dom";
import Axios from "axios";
import { ContractContext } from "../App";

import { Widget } from "react-chat-widget";
// import 'react-chat-widget/lib/styles.css';
import Createtokenx from "../slate/Createtokenx";
import FullScreenDialog from "./FullScreenDialog";
import merge from "lodash.merge";
import Currselect from "../components/Currselect";

merge(defaults, {
  global: {
    // line: {
    //   borderColor: '#F85F73',
    //  },
    defaultFontColor: "#78acd3",
    legend: {
      display: false,
    },
  },
});

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
  const [currentCurrency, setcurrentCurrency] = useState(0);

  const [lenderRates, setlenderRates] = useState([]);
  const [borrowerRates, setborrowerRates] = useState([]);

  const [fileth, setfileth] = useState(0);

  //del
  const bs = [0, 0.4, 0.6, 0.7, 0.75, 0.775, 0.79];
  const ls = [0, 0.3, 0.4, 0.45, 0.475, 0.485, 0.491];
  const ms = [];

  for (let i = 0; i < bs.length; i++) {
    const x = (bs[i] + ls[i]) / 2;
    ms.push(x);
  }

  const data = {
    labels: ["0", "3m", "6m", "1y", "2y", "3y", "5y"],
    datasets: [
      {
        label: "Borrow",
        fill: true,
        lineTension: 0.2,
        backgroundColor: "rgb(214, 115, 90,0.1)",
        borderColor: "#d6735a",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "#d6735a",
        pointBackgroundColor: "white",
        pointBorderWidth: 1,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "#d6735a",
        pointHoverBorderWidth: 1.5,
        pointRadius: 1.7,
        pointHitRadius: 5,
        data: bs,
        borderWidth: 0.5,
        opacity: 0.1,
      },
      {
        label: "Lend",
        fill: true,
        lineTension: 0.2,
        backgroundColor: "rgb(62, 105, 137,0.5)",
        borderColor: "#3e6989",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "#3e6989",
        pointBackgroundColor: "white",
        pointBorderWidth: 1,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "#3e6989",
        pointHoverBorderWidth: 1.5,
        pointRadius: 1.7,
        pointHitRadius: 5,
        data: ls,
        borderWidth: 0.5,
      },
      {
        label: "Mid Price",
        fill: false,
        lineTension: 0.2,
        backgroundColor: "rgb(199, 149, 86,0.5)",
        borderColor: "#c79556",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "#c79556",
        pointBackgroundColor: "white",
        pointBorderWidth: 1,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "#c79556",
        pointHoverBorderWidth: 1.5,
        pointRadius: 1.7,
        pointHitRadius: 5,
        data: ms,
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
      }

      if (contract.fxContract) {
        const fileth = await contract.fxContract.methods.getMidRates().call();
        setfileth(parseInt(fileth[0]) / 1000);
      }
    })();
    return () => {};
  }, [count, contract]);

  return (
    <div style={{ position: "relative" }}>
      <Grid container spacing={3} className={classes.gridClass}>
        <Redirect to="/moneymkt/3m" />

        <Grid item xs={6} align="center">
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 24 }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                marginLeft: 30,
              }}
            >
              <Currselect
                onChange={(e) => {
                  setcurrentCurrency(e.target.value);
                }}
                currentValue={currentCurrency}
              />
            </div>
            <div
              style={{
                fontWeight: 400,
                fontSize: 22,
                paddingLeft: 26,
                marginRight: 33,
              }}
            >
              Loan Rates
            </div>
            <div style={{ display: "flex" }}>
              <div>
                <Button
                  variant="contained"
                  size="small"
                  style={{
                    background: "#d6735a",
                    borderRadius: 0,
                    outline: "none",
                    marginRight: 5,
                  }}
                  disableElevation
                  disableFocusRipple
                  disableRipple
                >
                  Borrow
                </Button>
              </div>
              <div>
                <Button
                  variant="contained"
                  size="small"
                  style={{
                    background: "#3e6989",
                    borderRadius: 0,
                    outline: "none",
                    marginRight: 5,
                  }}
                  disableElevation
                  disableFocusRipple
                  disableRipple
                >
                  Lending
                </Button>
              </div>
              <div>
                <Button
                  variant="contained"
                  size="small"
                  style={{
                    background: "#c79556",
                    borderRadius: 0,
                    outline: "none",
                  }}
                  disableElevation
                  disableFocusRipple
                  disableRipple
                >
                  Mid price
                </Button>
              </div>
            </div>
          </div>
          <Line data={data} />
          <Paper className={classes.paper} style={{ marginTop: 8 }}>
            <div className={classes.priceQuote}>
              1 FIL = {`${"fileth" ? 0.079 : ".."} ETH`}
            </div>
          </Paper>
          <Paper className={classes.paper} style={{ marginTop: 8 }}>
            <div>
              <FullScreenDialog></FullScreenDialog>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={6} className={classes.ok}>
          <Right res={res} />
        </Grid>
      </Grid>
      <div style={{ position: "absolute", left: 0 }}>{/* <Widget /> */}</div>
    </div>
  );
}
