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
    <Grid container spacing={2} className={classes.gridItem}>
      <Grid item xs={8}>
        <Paper className={classes.paper}>
          <div id="apex">
            <ApexChart
              options={{
                colors: ["#ff0000", "#ff0000"],
              }}
            />
          </div>
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper className={classes.paper}>
          <div>
            <ReactVirtualizedTable
              rows={asks}
              columns={[
                {
                  width: 100,
                  label: "Amount",
                  dataKey: "size",
                  flexGrow: 1,
                },
                {
                  width: 120,
                  label: "Rate %",
                  dataKey: "rate",
                  numeric: true,
                },
              ]}
            />
          </div>
          <div className={classes.midPrice}>
            ${Math.round((asks[asks.length - 1].rate + bids[0].rate) / 2)}
          </div>
          <div>
            <ReactVirtualizedTable
              rows={bids}
              columns={[
                {
                  width: 100,
                  label: "Amount",
                  dataKey: "size",
                  flexGrow: 1,
                },
                {
                  width: 120,
                  label: "Rate %",
                  dataKey: "rate",
                  numeric: true,
                },
              ]}
            />
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
}
