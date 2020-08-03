import React, { useEffect, useState } from 'react';
import { Paper, Card, makeStyles, Grid } from '@material-ui/core';
import { Line } from 'react-chartjs-2';
import Right from './moneymkt/Right';
import { useRouteMatch, Redirect } from 'react-router-dom';
import Axios from 'axios';



const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: '100%',
  },
  priceQuote: {
    textAlign: 'center',
    marginTop: theme.spacing(2),
    fontSize: '1.5rem',
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
}));

export default function MoneyMKT(props) {
  const classes = useStyles();
  let x = useRouteMatch();
  const [res, setRes] = useState({});

  const data = {
    labels: ['3m', '6m', '1y', '2y', '3y','5y'],
    datasets: [
      {
        label: 'Lend',
        fill: false,
        lineTension: 0.2,
        backgroundColor: 'white',
        borderColor: 'yellow',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'yellow',
        pointBackgroundColor: 'white',
        pointBorderWidth: 1,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'yellow',
        pointHoverBorderWidth: 1.5,
        pointRadius: 1.7,
        pointHitRadius: 5,
        data: res.loan?res.loan.FIL.lenderbook.map(b=>b.rate):[],
        borderWidth: 0.5,
      },
      {
        label: 'Borrow',
        fill: false,
        lineTension: 0.2,
        backgroundColor: 'white',
        borderColor: 'green',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'green',
        pointBackgroundColor: 'white',
        pointBorderWidth: 1,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'green',
        pointHoverBorderWidth: 1.5,
        pointRadius: 1.7,
        pointHitRadius: 5,
        data: res.loan?res.loan.FIL.borrowerbook.map(b=>b.rate):[],
        borderWidth: 0.5,
      },
    ],
  };

  useEffect(() => {
    Axios.get(
      'https://ipfs.io/ipfs/QmXDehr8oXPNQ6ixNvrge1ay5PTW9mJMRbYtNaV1Bbgzu6',
    ).then((res) => {
      setRes(res.data);
    });

    return () => {};
  }, []);

  console.log('res',res);

  return (
    <Grid container spacing={3} className={classes.gridClass}>      
      <Redirect to="/moneymkt/3m"/>
      
      <Grid
        item
        xs={5}
        align="center"
      >
        <Paper className={classes.paper}>
          <Line data={data} />
        </Paper>
        <Paper className={classes.paper} style={{ marginTop: 8 }}>
          <div className={classes.priceQuote}>1 FIL = 0.85 ETH</div>
        </Paper>
      </Grid>
      <Grid item xs={7} className={classes.ok}>
        <Paper>
          <Right res={res}/>
        </Paper>
      </Grid>
    </Grid>
  );
}
