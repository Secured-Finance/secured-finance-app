import React, { useContext, useEffect } from 'react';
import { Tabs, Tab, makeStyles } from '@material-ui/core';
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
import Duration from './Duration';
import { ContractContext } from '../../App';

const useStyles = makeStyles((theme) => ({
  tab: {
    '&:hover': {
      textDecoration: 'none',
      color: '#fff',
    },
  },
}));

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const ccyPairs = ['ETH', 'FIL'];

export default function Right(props) {
  const [tabValue, setTabValue] = React.useState('3m');
  const [allBooks, setallBooks] = React.useState([]);
  let { url } = useRouteMatch();
  const classes = useStyles();
  const contract = useContext(ContractContext);

  const handleChange = (event, index) => {
    console.log('handleChange', tabValue);
    setTabValue(tabs[index]);
  };

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
    if (contract.moneymarketContract) {
      const x = contract.moneymarketContract.methods
        .getAllBooks()
        .call()
        .then((r) => {
          console.log('ccc', r);
          setallBooks(r);
        });
    }
    return () => {};
  }, [tabValue, contract]);

  console.log('allBooks', allBooks);

  return (
    <div>
      <Tabs
        value={tabs.indexOf(tabValue)}
        onChange={handleChange}
        aria-label="simple tabs example"
        variant="fullWidth"
      >
        {tabs.map((tab) => (
          <Tab
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
      </Tabs>
      <Switch>
        <Route exact path={`/moneymkt/:duration`}>
          <Duration orderbook={orderbook} />
        </Route>
      </Switch>
    </div>
  );
}
