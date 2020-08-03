import React from 'react';
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

export default function Right(props) {
  const [tabValue, setTabValue] = React.useState('3m');
  let { url } = useRouteMatch();
  const classes = useStyles();

  const handleChange = (event, index) => {
    console.log('handleChange', tabValue);
    setTabValue(tabs[index]);
  };

  const tabs = ['3m', '6m', '1y', '2y', '3y', '5y'];

  const { res } = props;

  let orderbook = { lenderbook: [], borrowerbook: [] };

  if (res.loan) {
    orderbook = {
      lenderbook: res.loan.FIL.lenderbook.filter((l) => l.term === tabValue),
      borrowerbook: res.loan.FIL.borrowerbook.filter(
        (l) => l.term === tabValue,
      ),
    };
  }

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
