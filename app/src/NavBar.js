import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  makeStyles,
  Avatar,
  Tabs,
  Tab,
  Box,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';
import logo from './logo.jpeg';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: '100%',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    color: '#fff',
  },
  logo: {
    marginRight: 1,
  },
  navs: {
    display: 'flex',
    alignItems: 'center',
  },
  toolbar: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const tabs = ['MoneyMKT', 'Swap', 'FX', 'Book', 'History'];

export default function Navbar(props) {
  let location = useLocation();
  let word = location.pathname.slice(1);
  if (location.pathname.slice(1).indexOf('/') !== -1) {
    const end = location.pathname.slice(1).indexOf('/');
    word = location.pathname.slice(1, end + 1);
  }

  if (location.pathname.length === 1) {
    word = 'moneymkt';
  }
  console.log('word', word, tabs.map((t) => t.toLowerCase()).indexOf(word));
  const classes = useStyles();
  const [value, setValue] = React.useState(
    tabs.map((t) => t.toLowerCase()).indexOf(word),
  );
  console.log('classes', tabs.map((t) => t.toLowerCase()).indexOf(word));

  const handleChange = (event, newValue) => {
    console.log('new', newValue);
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Toolbar component="nav" variant="regular" className={classes.toolbar}>
          <Box className={classes.navs}>
            <Box
              component={Link}
              to="/moneymkt/3m"
              className={classes.navs}
              style={{ marginRight: 10 }}
            >
              <Avatar
                alt="Secured Finance"
                src={logo}
                className={classes.logo}
              />
              <Button>
                <Typography variant="h6" className={classes.title}>
                  Secured Finance
                </Typography>
              </Button>
            </Box>
            <select
              name=""
              id=""
              value={props.currentCurrency}
              style={{ height: 30 }}
              onChange={(e) => {
                props.setCurrentCurrency((e.target.value));
              }}
            >
              <option value="1">FIL</option>
              <option value="0">ETH</option>
            </select>
          </Box>

          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
            component={'div'}
            className={classes.navs}
          >
            {tabs.map((tab) => (
              <Tab
                label={tab}
                {...a11yProps(0)}
                key={tab}
                component={Link}
                to={`/${tab.toLowerCase()}`}
              />
            ))}
          </Tabs>
        </Toolbar>
      </AppBar>
    </div>
  );
}

Navbar.propTypes = {};
