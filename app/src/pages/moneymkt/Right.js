import React from 'react';
import { Tabs, Tab } from '@material-ui/core';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';
import Duration from './Duration';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Right(props) {
  const [value, setValue] = React.useState(0);
  let {url} = useRouteMatch();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabs = ['3m', '6m', '1y', '2y', '3y'];

  return (
    <div>
      <Tabs
        value={value}
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
          />
        ))}
      </Tabs>      
      <Route path={`/moneymkt/:duration`}>
        <Duration></Duration>
      </Route>
    </div>
  );
}

