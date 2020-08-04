import React from 'react';
import { Grid, Paper, makeStyles } from '@material-ui/core';
import ApexChart from './ApexChart';
import ReactVirtualizedTable from './moneymkt/component/ReactVirtualizedTable';

const useStyles = makeStyles((theme) => ({
  gridItem: {
    padding: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(1),
  },
  midPrice:{
    padding:"20px 10px",
    textAlign:'center',
    border:'1px dotted white'
  }
}));

export default function Fx() {
  const classes = useStyles();

  return (
    <Grid container spacing={2} className={classes.gridItem}>
      <Grid item xs={8}>
        <Paper className={classes.paper}>
          <ApexChart />
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper className={classes.paper}>
          <div>
            <ReactVirtualizedTable
              rows={[]}
              columns={[
                {
                  width: 100,
                  label: 'Amount',
                  dataKey: 'size',
                  flexGrow: 1,
                },
                {
                  width: 120,
                  label: 'Rate %',
                  dataKey: 'rate',
                  numeric: true,
                },
              ]}
            />
          </div>
          <div className={classes.midPrice}>$92</div>
          <div>
            <ReactVirtualizedTable
              rows={[]}
              columns={[
                {
                  width: 100,
                  label: 'Amount',
                  dataKey: 'size',
                  flexGrow: 1,
                },
                {
                  width: 120,
                  label: 'Rate %',
                  dataKey: 'rate',
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
