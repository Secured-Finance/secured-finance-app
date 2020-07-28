import React from 'react';
import { Paper, Card, makeStyles, Grid } from '@material-ui/core';
import { Line } from 'react-chartjs-2';
import Right from './moneymkt/Right';
import { useRouteMatch } from 'react-router-dom';

const data = {
  labels: ['3m', '6m', '1y', '2y', '3y'],
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
      data: [1, 8, 14, 18, 20, 25],
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
      data: [2, 16, 28, 36, 40, 50],
      borderWidth: 0.5,
    },
  ],
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: '100%',
  },
  priceQuote:{
    textAlign:'center',
    marginTop:theme.spacing(2),
    fontSize:"1.5rem"
  },
  paper:{
    minHeight:'55vh'
  },
  gridClass:{
    padding:theme.spacing(2)
  },
  graph:{
    paddingTop:100
  }
}));

export default function MoneyMKT(props) {
  const classes = useStyles();
  let x = useRouteMatch();
  console.log('mmm',x)

  return (
    <Paper className={classes.paper}>          
      <Grid container spacing={3} className={classes.gridClass} >
        <Grid
          item
          xs={5}
          className={classes.graph}
          center
          justify="center"
          align="center"
          direction="column"
          style={{paddingTop:50}}
        >
          <Line data={data} />
          <div className={classes.priceQuote}>1 FIL = 0.85 ETH</div>
        </Grid>
        <Grid item xs={7} className={classes.ok}>
          <Right

          /> 
        </Grid>
      </Grid>
    </Paper>
  );
}
