import React, { useContext, useEffect, useState } from 'react';
import {
  Tabs,
  Tab,
  makeStyles,
  Button,
  List,
  ListItem,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Backdrop,
  withStyles,
} from '@material-ui/core';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useLocation,
  useRouteMatch,
  Redirect,
} from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Duration from './Duration';
import { ContractContext } from '../../App';
import Slide from '@material-ui/core/Slide';
import BootstrapInput from './component/BootstrapInput';
import { Checkmark } from 'react-checkmark';

const useStyles = makeStyles((theme) => ({
  tab: {
    '&:hover': {
      textDecoration: 'none',
      color: '#fff',
    },
  },
  dialog: {
    padding: theme.spacing(8),
    minWidth: 230,
  },
  dialogBtn: {
    textAlign: 'center',
    marginTop: 20,
  },
  dContent: {
    position: 'relative',
  },
  spinner: {
    position: 'absolute',
    display: 'flex',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    // textAlign: 'center',
    // top: '50%',
    // transform: 'translateY(-50%)',
    background: '#424242',
    zIndex: 999,
    // height:400,
    // width:600
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const StyledTabs = withStyles({
  root: {
    background: '#303030',
  },
  indicator: {
    top: 0,
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > div': {
      maxWidth: 20,
      width: '100%',
      maxHeight:1,
      backgroundColor: 'white',
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    color: '#fff',
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    '&:focus': {
      opacity: 1,
    },
    '&:hover': {
      textDecoration: 'none',
      color: 'inherit',
    },
    '&$selected': {
      // color: '#1890ff',
      fontWeight: theme.typography.fontWeightMedium,
      background: '#424242',
      border: ' 0.1px solid transparent',
      borderBottom: 'none',
      borderTopLeftRadius: '.25rem',
      borderTopRightRadius: '.25rem',
      // border:'1px dashed #212121'
    },
  },
  selected: {},
}))((props) => <Tab {...props} />);

const ccyPairs = ['ETH', 'FIL'];

const ChosenRowContext = React.createContext({});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Right(props) {
  const [tabValue, setTabValue] = React.useState('3m');
  const [allBooks, setallBooks] = React.useState([]);
  const [midRates, setmidRates] = React.useState([]);
  let { url } = useRouteMatch();
  const classes = useStyles();
  const contract = useContext(ContractContext);

  const [open, setopen] = useState(false);
  const [currType, setcurrType] = useState(null);
  const [selectedRow, setselectedRow] = useState(null);

  const [dialogAmount, setdialogAmount] = useState('');
  const [dialogLoading, setdialogLoading] = useState(false);
  const [dialogState, setdialogState] = useState(null);

  console.log('selectedRow', selectedRow);

  const handleChange = (event, index) => {
    console.log('handleChange', tabValue);
    setTabValue(tabs[index]);
  };

  const confirmLoan = async () => {
    setdialogLoading(true);
    // console.log('confirmLoan',
    // selectedRow.addr,
    //       ['borrow','lend' ].indexOf(currType),
    // Number(contract.currentCurrency),
    // tabs.indexOf(tabValue),
    // Number(dialogAmount),
    // )

    // contract.loanContract.options.gasPrice = '20000000000000';
    try {
      const res = await contract.loanContract.methods
        .makeLoanDeal(
          selectedRow.addr,
          ['borrow', 'lend'].indexOf(currType),
          Number(contract.currentCurrency),
          tabs.indexOf(tabValue),
          Number(dialogAmount),
        )
        .send({
          from: contract.account,
          // gas: 8000000,
          // gasPrice: '30000000000'
        });
      setdialogLoading(false);
      setdialogState('s');
    } catch (e) {
      console.log('ERRRRRRRRRRR', e);
      setdialogLoading(false);
      setdialogState('e');
    } finally {
      setTimeout(() => {
        setcurrType(null);
        setdialogState(null);
      }, 3000);
    }
  };

  console.log('currType', tabValue);

  const tabs = ['3m', '6m', '1y', '2y', '3y', '5y'];

  const { res } = props;

  let orderbook = { lenderbook: [], borrowerbook: [] };

  let borrowers = {};
  let lenders = {};

  for (const tab of tabs) {
    borrowers[tab] = [];
    lenders[tab] = [];
  }

  if (res.loan) {
    // orderbook = {
    //   lenderbook: res.loan.FIL.lenderbook.filter((l) => l.term === tabValue),
    //   borrowerbook: res.loan.FIL.borrowerbook.filter(
    //     (l) => l.term === tabValue,
    //   ),
    // };

    for (let book of allBooks) {
      const curr_borrowers = book.borrowers[parseInt(contract.currentCurrency)];
      const curr_lenders = book.lenders[parseInt(contract.currentCurrency)];
      console.log('allboo', curr_borrowers);

      for (let borrower of curr_borrowers) {
        console.log('allboo 1', borrower);
        const termIndex = tabs[parseInt(borrower[0])];
        borrowers[termIndex] = borrowers[termIndex].concat({
          term: parseInt(borrower[0]),
          amount: parseInt(borrower[1]),
          rate: parseInt(borrower[2]) / 100,
          goodtil: parseInt(borrower[3]),
          addr: borrower[5],
        });
      }

      for (let lender of curr_lenders) {
        console.log('allboo 1', lender);
        const termIndex = tabs[parseInt(lender[0])];
        lenders[termIndex] = lenders[termIndex].concat({
          term: parseInt(lender[0]),
          amount: parseInt(lender[1]),
          rate: parseInt(lender[2]) / 100,
          goodtil: parseInt(lender[3]),
          addr: lender[5],
        });
      }
      console.log('allboo 2', borrowers, lenders);
      // break
    }
  }

  orderbook = {
    lenderbook: lenders[tabValue],
    borrowerbook: borrowers[tabValue],
  };

  useEffect(() => {
    (async () => {
      if (contract.moneymarketContract) {
        try {
          const allBooks = await contract.moneymarketContract.methods
            .getAllBooks()
            .call();

          setallBooks(allBooks);

          const midRates = await contract.moneymarketContract.methods
            .getMidRates()
            .call();
          console.log('midRates', midRates);
          setmidRates(midRates);
        } catch (error) {}
      }
    })();

    return () => {};
  }, [tabValue, contract]);

  console.log('allBooks', allBooks);

  let currentMidrate = 0;
  if (midRates.length > 0) {
    currentMidrate =
      Number(
        midRates[parseInt(contract.currentCurrency)][tabs.indexOf(tabValue)],
      ) / 100;
  }

  return (
    <div>
      <StyledTabs
        value={tabs.indexOf(tabValue)}
        onChange={handleChange}
        aria-label="simple tabs example"
        variant="fullWidth"
      >
        {tabs.map((tab) => (
          <StyledTab
            wrapped
            label={tab}
            {...a11yProps(0)}
            key={tab}
            component={Link}
            to={`${url}/${tab.toLowerCase()}`}
            style={{ minWidth: '80px' }}
            className={classes.tab}
          />
        ))}
      </StyledTabs>
      <Switch>
        <Route exact path={`/moneymkt/:duration`}>
          <Duration
            orderbook={orderbook}
            currentMidrate={currentMidrate}
            setcurrType={setcurrType}
            setselectedRow={setselectedRow}
          />
        </Route>
      </Switch>
      <Dialog
        open={currType !== null}
        onClose={() => setcurrType(null)}
        aria-labelledby="responsive-dialog-title"
        TransitionComponent={Transition}
        className={classes.dialog}
        style={{ padding: 40 }}
        fullWidth={true}
      >
        <DialogTitle
          id="responsive-dialog-title"
          style={{ textAlign: 'center' }}
        >
          {currType ? currType.toUpperCase() : 'Details'}
        </DialogTitle>
        <DialogContent dividers className={classes.dContent}>
          <Backdrop className={classes.backdrop} open={dialogLoading}>
            <CircularProgress color="primary" />
          </Backdrop>
          {/* {dialogLoading ? (
            <div className={classes.spinner}>
              <CircularProgress color="secondary" />
            </div>
          ) : null} */}
          {dialogState !== null ? (
            dialogState === 's' ? (
              <div className={classes.spinner}>
                <Checkmark size="xxLarge" />
              </div>
            ) : (
              <div className={classes.spinner}>FAILED</div>
            )
          ) : null}
          <Table className={classes.table} aria-label="simple table">
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row" align="right">
                  Counter Party:
                </TableCell>
                <TableCell align="left">
                  {selectedRow ? selectedRow.addr : null}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" align="right">
                  Currency:
                </TableCell>
                <TableCell align="left">
                  {ccyPairs[contract.currentCurrency]}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" align="right">
                  Term:
                </TableCell>
                <TableCell align="left">
                  {selectedRow ? selectedRow.term : null}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" align="right">
                  Rate:
                </TableCell>
                <TableCell align="left">
                  {selectedRow ? selectedRow.rate : null}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" align="right">
                  Max Amount:
                </TableCell>
                <TableCell align="left">
                  {selectedRow ? selectedRow.amount : null}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" align="right">
                  Amount:
                </TableCell>
                <TableCell align="left">
                  <BootstrapInput
                    value={dialogAmount}
                    onChange={(e) => {
                      console.log('ok', e.target.value);
                      setdialogAmount(e.target.value);
                    }}
                    type={'number'}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className={classes.dialogBtn}>
            <Button variant="contained" color="primary" onClick={confirmLoan}>
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
