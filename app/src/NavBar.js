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
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

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
  },
  toolbar: {
    justifyContent: 'space-between',
  },
}));

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Navbar(props) {
  const classes = useStyles();
  console.log('classes', classes);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabs = ['MoneyMKT', 'Swap', 'FX', 'Book', 'History'];

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Toolbar component="nav" variant="regular" className={classes.toolbar}>
          <Box className={classes.navs} component={Link} to="/moneymkt">
            <Avatar
              alt="Remy Sharp"
              src="./logo.jpeg"
              className={classes.logo}
            />
            <Button>
              <Typography variant="h6" className={classes.title}>
                Secured Finance
              </Typography>
            </Button>
          </Box>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
            component={'ul'}
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
