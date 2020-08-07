import React, { useState, useContext, useEffect } from 'react';
import {
  Container,
  Paper,
  makeStyles,
  Grid,
  Input,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import clsx from 'clsx';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import isNumber from 'isnumber';

import { ContractContext } from '../App';
// import { Alert } from 'react-bootstrap';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
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

  right: {
    borderLeft: '1px dashed white',
    paddingLeft: theme.spacing(5),
    position: 'relative',
  },
  hidden: {
    visibility: 'hidden',
  },
  progressLoan: {
    minWidth: 200,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  titleContainer: {
    marginBottom: 20,
    position: 'relative',
  },
}));

export default function Book() {
  const classes = useStyles();
  const { REACT_APP_IS_DEV } = process.env;
  console.log('REACT_APP_IS_DEV', REACT_APP_IS_DEV);

  let b3mi = '';
  let l3mi = '';
  let a3mi = '';
  let b6mi = '';
  let l6mi = '';
  let a6mi = '';
  let b1yi = '';
  let l1yi = '';
  let a1yi = '';
  let b2yi = '';
  let l2yi = '';
  let a2yi = '';
  let b3yi = '';
  let l3yi = '';
  let a3yi = '';
  let b5yi = '';
  let l5yi = '';
  let a5yi = '';

  let buyFilVali = '';
  let sellEthVali = '';
  let sellFilVali = '';
  let buyEthVali = '';

  if (REACT_APP_IS_DEV) {
    b3mi = Math.round((Math.random() + 1) * 100) / 100 + '';
    l3mi = Math.round((Math.random() + 1) * 100) / 100 + '';
    a3mi = Math.round(Math.random() * 1000) + '';
    b6mi = Math.round((Math.random() + 1) * 100) / 100 + '';
    l6mi = Math.round((Math.random() + 1) * 100) / 100 + '';
    a6mi = Math.round(Math.random() * 1000) + '';
    b1yi = Math.round((Math.random() + 1) * 100) / 100 + '';
    l1yi = Math.round((Math.random() + 1) * 100) / 100 + '';
    a1yi = Math.round(Math.random() * 1000) + '';
    b2yi = Math.round((Math.random() + 1) * 100) / 100 + '';
    l2yi = Math.round((Math.random() + 1) * 100) / 100 + '';
    a2yi = Math.round(Math.random() * 1000) + '';
    b3yi = Math.round((Math.random() + 1) * 100) / 100 + '';
    l3yi = Math.round((Math.random() + 1) * 100) / 100 + '';
    a3yi = Math.round(Math.random() * 1000) + '';
    b5yi = Math.round((Math.random() + 1) * 100) / 100 + '';
    l5yi = Math.round((Math.random() + 1) * 100) / 100 + '';
    a5yi = Math.round(Math.random() * 1000) + '';

    buyFilVali = Math.round(Math.random() * 1000) + '';
    sellEthVali = Math.round(Math.random() * 100) + '';
    sellFilVali = Math.round(Math.random() * 1000) + '';
    buyEthVali = Math.round(Math.random() * 100) + '';
  }

  const [b3m, setb3m] = useState(b3mi);
  const [l3m, setl3m] = useState(l3mi);
  const [a3m, seta3m] = useState(a3mi);
  const [b6m, setb6m] = useState(b6mi);
  const [l6m, setl6m] = useState(l6mi);
  const [a6m, seta6m] = useState(a6mi);
  const [b1y, setb1y] = useState(b1yi);
  const [l1y, setl1y] = useState(l1yi);
  const [a1y, seta1y] = useState(a1yi);
  const [b2y, setb2y] = useState(b2yi);
  const [l2y, setl2y] = useState(l2yi);
  const [a2y, seta2y] = useState(a2yi);
  const [b3y, setb3y] = useState(b3yi);
  const [l3y, setl3y] = useState(l3yi);
  const [a3y, seta3y] = useState(a3yi);
  const [b5y, setb5y] = useState(b5yi);
  const [l5y, setl5y] = useState(l5yi);
  const [a5y, seta5y] = useState(a5yi);

  const [buyFilVal, setbuyFilVal] = useState(buyFilVali);
  const [sellEthVal, setsellEthVal] = useState(sellEthVali);
  const [sellFilVal, setsellFilVal] = useState(sellFilVali);
  const [buyEthVal, setbuyEthVal] = useState(buyEthVali);

  const [isLoanLoading, setisLoanLoading] = useState(false);
  const [isFxLoading, setisFxLoading] = useState(false);

  const [isFxShow, setisFxShow] = useState(false);
  const [isFxSuccess, setisFxSuccess] = useState(false);

  const [isLoanShow, setisLoanShow] = useState(false);
  const [isLoanSuccess, setisLoanSuccess] = useState(false);

  const contract = useContext(ContractContext);

  console.log('contract', contract);
  console.log('numb', typeof contract.currentCurrency);

  // if (contract.web3) {
  //   contract.web3.eth
  //     .getTransaction(
  //       '0x32bd75a22634687f6915da1e06c46076347b4c99175ef0583a9302d2e07adb27',
  //     )
  //     .then((r) => {
  //       console.log('ww', r);
  //     });
  // }

  useEffect(() => {
    const id = setTimeout(() => {
      // setisLoanShow(false)
      setisFxShow(false);
    }, 4000);
    return () => {
      clearTimeout(id);
    };
  });

  const resetFx = () => {
    setbuyFilVal('');
    setsellEthVal('');
    setsellFilVal('');
    setbuyEthVal('');
  };

  const resetLoan = () => {
    setb3m('');
    setl3m('');
    seta3m('');
    setb6m('');
    setl6m('');
    seta6m('');
    setb1y('');
    setl1y('');
    seta1y('');
    setb2y('');
    setl2y('');
    seta2y('');
    setb3y('');
    setl3y('');
    seta3y('');
    setb5y('');
    setl5y('');
    seta5y('');
  };

  return (
    <Paper className={classes.root}>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={9}>
            <Grid container justify="center" className={classes.titleContainer}>
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
                <div style={{ fontSize: '1.2rem' }}>Borrow %</div>
              </Grid>
              <Grid item xs={3}>
                <div style={{ fontSize: '1.2rem' }}>Lend %</div>
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
                    let val = e.target.value;

                    if (!isNumber(val) && val !== '') {
                      return;
                    }

                    setb3m(val);
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={b3m}
                />
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    let val = e.target.value;

                    if (!isNumber(val) && val !== '') {
                      return;
                    }

                    setl3m(val);
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={l3m}
                />
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    let val = e.target.value;

                    if (!isNumber(val) && val !== '') {
                      return;
                    }

                    seta3m(val);
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
                    let val = e.target.value;

                    if (!isNumber(val) && val !== '') {
                      return;
                    }

                    setb6m(val);
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={b6m}
                />
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    let val = e.target.value;

                    if (!isNumber(val) && val !== '') {
                      return;
                    }

                    setl6m(val);
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={l6m}
                />
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    let val = e.target.value;

                    if (!isNumber(val) && val !== '') {
                      return;
                    }

                    seta6m(val);
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
                    let val = e.target.value;

                    if (!isNumber(val) && val !== '') {
                      return;
                    }

                    setb1y(val);
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={b1y}
                />
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    let val = e.target.value;

                    if (!isNumber(val) && val !== '') {
                      return;
                    }

                    setl1y(val);
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={l1y}
                />
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    let val = e.target.value;

                    if (!isNumber(val) && val !== '') {
                      return;
                    }

                    seta1y(val);
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
                    let val = e.target.value;

                    if (!isNumber(val) && val !== '') {
                      return;
                    }

                    setb2y(val);
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={b2y}
                />
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    let val = e.target.value;

                    if (!isNumber(val) && val !== '') {
                      return;
                    }

                    setl2y(val);
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={l2y}
                />
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    let val = e.target.value;

                    if (!isNumber(val) && val !== '') {
                      return;
                    }

                    seta2y(val);
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
                    let val = e.target.value;

                    if (!isNumber(val) && val !== '') {
                      return;
                    }

                    setb3y(val);
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={b3y}
                />
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    let val = e.target.value;

                    if (!isNumber(val) && val !== '') {
                      return;
                    }

                    setl3y(val);
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={l3y}
                />
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    let val = e.target.value;

                    if (!isNumber(val) && val !== '') {
                      return;
                    }

                    seta3y(val);
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
                    let val = e.target.value;

                    if (!isNumber(val) && val !== '') {
                      return;
                    }

                    setb5y(val);
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={b5y}
                />
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    let val = e.target.value;

                    if (!isNumber(val) && val !== '') {
                      return;
                    }

                    setl5y(val);
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={l5y}
                />
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    let val = e.target.value;

                    if (!isNumber(val) && val !== '') {
                      return;
                    }

                    seta5y(val);
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
              direction="column"
            >
              <Grid item>
                <Box
                  m={1}
                  className={clsx(
                    !isLoanLoading && classes.hidden,
                    classes.progressLoan,
                  )}
                >
                  <LinearProgress color="secondary" />
                </Box>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={async () => {
                    setisLoanLoading(true);
                    console.log('setMoneyMarketBook', contract.currentCurrency);
                    try {
                      const result = await contract.moneymarketContract.methods
                        .setMoneyMarketBook(
                          Number(contract.currentCurrency),
                          [
                            [0, parseInt(a3m), Math.round(Number(l3m) * 100)],
                            [1, parseInt(a6m), Math.round(Number(l6m) * 100)],
                            [2, parseInt(a1y), Math.round(Number(l1y) * 100)],
                            [3, parseInt(a2y), Math.round(Number(l2y) * 100)],
                            [4, parseInt(a3y), Math.round(Number(l3y) * 100)],
                            [5, parseInt(a5y), Math.round(Number(l5y) * 100)],
                          ],
                          [
                            [0, parseInt(a3m), Math.round(Number(b3m) * 100)],
                            [1, parseInt(a6m), Math.round(Number(b6m) * 100)],
                            [2, parseInt(a1y), Math.round(Number(b1y) * 100)],
                            [3, parseInt(a2y), Math.round(Number(b2y) * 100)],
                            [4, parseInt(a3y), Math.round(Number(b3y) * 100)],
                            [5, parseInt(a5y), Math.round(Number(b5y) * 100)],
                          ],
                          3600,
                        )
                        .send({
                          from: contract.account,
                          gas: 3000000,
                        });

                      setisLoanShow(true);
                      setisLoanSuccess(true);
                      resetLoan();
                    } catch (e) {
                      setisLoanShow(true);
                      setisLoanSuccess(false);
                    }
                    setisLoanLoading(false);
                  }}
                >
                  Set Loan Book
                </Button>
              </Grid>
            </Grid>
          </Grid>
          {/* RIght side */}
          <Grid item xs={3} className={classes.right}>
            <Grid item>
              <Grid container direction="column" style={{ marginBottom: 30 }}>
                <Box>
                  <Typography
                    variant="h4"
                    component="h6"
                    align="center"
                    color="textPrimary"
                    gutterBottom
                    noWrap
                  >
                    Fx
                  </Typography>
                </Box>
                <Box>
                  <Alert
                    variant="outlined"
                    severity={isFxSuccess ? 'success' : 'error'}
                    className={clsx(!isFxShow && classes.hidden)}
                  >
                    {isFxSuccess
                      ? 'Transaction success!'
                      : 'Transaction failure'}
                    !
                  </Alert>
                </Box>
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
                        onChange={(e) => {
                          if (
                            !isNumber(e.target.value) &&
                            e.target.value !== ''
                          ) {
                            return;
                          }

                          setbuyFilVal(Number(e.target.value));
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Input
                        inputProps={{ 'aria-label': 'description' }}
                        disableUnderline
                        required
                        className={classes.ccy}
                        value={sellEthVal}
                        onChange={(e) => {
                          if (
                            !isNumber(e.target.value) &&
                            e.target.value !== ''
                          ) {
                            return;
                          }

                          setsellEthVal(e.target.value);
                        }}
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
                        onChange={(e) => {
                          if (
                            !isNumber(e.target.value) &&
                            e.target.value !== ''
                          ) {
                            return;
                          }
                          setsellFilVal(e.target.value);
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Input
                        inputProps={{ 'aria-label': 'description' }}
                        disableUnderline
                        required
                        className={classes.ccy}
                        value={buyEthVal}
                        onChange={(e) => {
                          if (
                            !isNumber(e.target.value) &&
                            e.target.value !== ''
                          ) {
                            return;
                          }
                          setbuyEthVal(e.target.value);
                        }}
                      />
                    </Grid>
                  </Grid>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Box m={1} className={clsx(!isFxLoading && classes.hidden)}>
                    {console.log('isFxLoading', isFxLoading)}
                    <LinearProgress />
                  </Box>

                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={async () => {
                      console.log(
                        'setFX',
                        contract.account,
                        buyFilVal,
                        sellEthVal,
                        sellFilVal,
                        buyEthVal,
                      );

                      setisFxLoading(true);
                      try {
                        const result = await contract.fxContract.methods
                          .setFXBook(
                            0,
                            [
                              1,
                              0,
                              buyFilVal ? Number(buyFilVal) : 0,
                              sellEthVal ? Number(sellEthVal) : 0,
                            ],
                            [
                              0,
                              1,
                              sellFilVal ? Number(sellFilVal) : 0,
                              buyEthVal ? Number(buyEthVal) : 0,
                            ],
                            3600,
                          )
                          .send({
                            from: contract.account,
                            gas: 3000000,
                          });

                        setisFxShow(true);
                        setisFxSuccess(true);
                        resetFx();

                        console.log('result', result);
                      } catch (e) {
                        setisFxShow(true);
                        setisFxSuccess(false);

                        console.log('err tr', e);
                      }
                      setisFxLoading(false);
                    }}
                  >
                    Set FX
                  </Button>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={isLoanShow}
        onClose={() => {
          setisLoanShow(false);
        }}
        key={'topcenter'}
        autoHideDuration={3000}
        style={{ padding: 30 }}
      >
        <Alert severity={isLoanSuccess ? 'success' : 'error'}>
          {isLoanSuccess ? 'Loan Book is set!' : 'Error'}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
