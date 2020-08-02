import React, { useState, useContext } from 'react';
import {
  Container,
  Paper,
  makeStyles,
  Grid,
  Input,
  Button,
  Typography,
} from '@material-ui/core';
import { ContractContext } from '../App';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  loanBookBtn: {
    padding: theme.spacing(4),
  },
  ccy: {
    borderWidth: 1,
    borderColor: 'white',
    borderStyle: 'solid',
    padding: 1,
  },

  left:{

    borderLeft: '1px solid white', 
    paddingLeft:theme.spacing(5)
  }
}));

export default function Book() {
  const classes = useStyles();
  const [b3m, setb3m] = useState('');
  const [l3m, setl3m] = useState('');
  const [a3m, seta3m] = useState('');
  const [b6m, setb6m] = useState('');
  const [l6m, setl6m] = useState('');
  const [a6m, seta6m] = useState('');
  const [b1y, setb1y] = useState('');
  const [l1y, setl1y] = useState('');
  const [a1y, seta1y] = useState('');
  const [b2y, setb2y] = useState('');
  const [l2y, setl2y] = useState('');
  const [a2y, seta2y] = useState('');
  const [b3y, setb3y] = useState('');
  const [l3y, setl3y] = useState('');
  const [a3y, seta3y] = useState('');
  const [b5y, setb5y] = useState('');
  const [l5y, setl5y] = useState('');
  const [a5y, seta5y] = useState('');
  const [buyFilVal, setbuyFilVal] = useState('');
  const [sellEthVal, setsellEthVal] = useState('');
  const [sellFilVal, setsellFilVal] = useState('');
  const [buyEthVal, setbuyEthVal] = useState('');

  const contract = useContext(ContractContext);

  console.log('contract', contract);

  if (contract.web3) {
    contract.web3.eth
      .getTransaction(
        '0x32bd75a22634687f6915da1e06c46076347b4c99175ef0583a9302d2e07adb27',
      )
      .then((r) => {
        console.log('ww', r);
      });
  }

  return (
    <Paper className={classes.root}>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={9}>
            <Grid container justify="center" style={{ marginBottom: 40 }}>
              <Typography
                variant="h4"
                component="h6"
                align="left"
                color="textPrimary"
                gutterBottom
                noWrap
              >
                Loan
              </Typography>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={2}></Grid>
              <Grid item xs={3}>
                <div style={{ fontSize: '1.2rem' }}>Borrow</div>
              </Grid>
              <Grid item xs={3}>
                <div style={{ fontSize: '1.2rem' }}>Lend</div>
              </Grid>
              <Grid item xs={3}>
                <div style={{ fontSize: '1.2rem' }}>Amount</div>
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid
                item
                xs={2}
                justify="flex-end"
                container
                alignItems="center"
              >
                3m
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    setb3m(Number(e.target.value));
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={b3m}
                />
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    setl3m(Number(e.target.value));
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={l3m}
                />
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    seta3m(Number(e.target.value));
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={a3m}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={2} justify="flex-end" container>
                6m
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    setb6m(Number(e.target.value));
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={b6m}
                />
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    setl6m(Number(e.target.value));
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={l6m}
                />
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    seta6m(Number(e.target.value));
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={a6m}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={2} justify="flex-end" container>
                1y
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    setb1y(Number(e.target.value));
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={b1y}
                />
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    setl1y(Number(e.target.value));
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={l1y}
                />
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    seta1y(Number(e.target.value));
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={a1y}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={2} justify="flex-end" container>
                2y
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    setb2y(Number(e.target.value));
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={b2y}
                />
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    setl2y(Number(e.target.value));
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={l2y}
                />
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    seta2y(Number(e.target.value));
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={a2y}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={2} justify="flex-end" container>
                3y
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    setb3y(Number(e.target.value));
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={b3y}
                />
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    setl3y(Number(e.target.value));
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={l3y}
                />
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    seta3y(Number(e.target.value));
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={a3y}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={2} justify="flex-end" container>
                5y
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    setb5y(Number(e.target.value));
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={b5y}
                />
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    setl5y(Number(e.target.value));
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={l5y}
                />
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    seta5y(Number(e.target.value));
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={a5y}
                />
              </Grid>
            </Grid>

            <Grid
              container
              spacing={3}
              justify="center"
              alignItems="center"
              className={classes.loanBookBtn}
            >
              <Button variant="contained" color="primary">
                Set Loan Book
              </Button>
            </Grid>
          </Grid>

          <Grid item xs={3} container className={classes.left}>
            <Grid container style={{ marginBottom: 40 }}>
              <Typography
                variant="h4"
                component="h6"
                align="left"
                color="textPrimary"
                gutterBottom
                noWrap
              >
                Fx
              </Typography>
            </Grid>
            <Grid container direction="column">
              <div style={{ marginBottom: 20 }}>
                <div>
                  <Typography
                    variant="subtitle1"
                    component="h6"
                    align="left"
                    color="textPrimary"
                    gutterBottom
                    noWrap
                  >
                    Buy FIL Sell ETH
                  </Typography>
                </div>
                <Grid container justify="center" spacing={2}>
                  <Grid item xs={6}>
                    <Input
                      inputProps={{ 'aria-label': 'description' }}
                      disableUnderline
                      required
                      className={classes.ccy}
                      value={buyFilVal}
                      onChange={(e) => setbuyFilVal(Number(e.target.value))}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Input
                      inputProps={{ 'aria-label': 'description' }}
                      disableUnderline
                      required
                      className={classes.ccy}
                      value={sellEthVal}
                      onChange={(e) => setsellEthVal(Number(e.target.value))}
                    />
                  </Grid>
                </Grid>
                <div style={{ marginTop: 20 }}>
                  <Typography
                    variant="subtitle1"
                    component="h6"
                    align="left"
                    color="textPrimary"
                    gutterBottom
                    noWrap
                  >
                    Sell FIL Buy ETH
                  </Typography>
                </div>
                <Grid container justify="center" spacing={2}>
                  <Grid item xs={6}>
                    <Input
                      inputProps={{ 'aria-label': 'description' }}
                      disableUnderline
                      required
                      className={classes.ccy}
                      value={sellFilVal}
                      onChange={(e) => setsellFilVal(Number(e.target.value))}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Input
                      inputProps={{ 'aria-label': 'description' }}
                      disableUnderline
                      required
                      className={classes.ccy}
                      value={buyEthVal}
                      onChange={(e) => setbuyEthVal(Number(e.target.value))}
                    />
                  </Grid>
                </Grid>
              </div>
              <div style={{ textAlign: 'center', marginTop: 40 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={async () => {
                    console.log('setFX');
                    await contract.fxContract.methods
                      .setFXBook(0, [1, 0, buyFilVal, sellEthVal], [0, 1, 1000, 750], 3600)
                      .send({
                        from: '0xdC4B87B1b7a3cCFb5d9e85C09a59923C0F6cdAFc',
                        gas: 3000000,
                      });
                  }}
                >
                  Set FX
                </Button>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Paper>
  );
}
