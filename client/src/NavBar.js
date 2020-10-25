import React, { Component, useState, useEffect } from "react";
import PropTypes from "prop-types";
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
  withStyles,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import logo from "./logo.jpeg";
import logobtnb from "./logobtnb.png";
import { Tooltip } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: "100%",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    color: "#fff",
  },
  logo: {
    marginRight: 1,
  },
  navs: {
    display: "flex",
    alignItems: "center",
  },
  toolbar: {
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

const useStylesTab = makeStyles((theme) => ({
  selected: {
    background: "#172734",
  },
}));

// connectBtn:{
//   background:
// }
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const tabs = ["MoneyMKT", "Swap", "FX", "Book", "History"];

const StyledTabs = withStyles({
  indicator: {
    // top: 0,
    display: "flex",
    // display: 'none',
    justifyContent: "center",
    backgroundColor: "transparent",
    "& > div": {
      maxWidth: 40,
      width: "100%",
      backgroundColor: "#31698c",
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    color: "#fff",
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    minWidth: 100,
    "&:focus": {
      opacity: 1,
    },
    "&:hover": {
      textDecoration: "none",
      color: "inherit",
    },
    "&$selected": {
      // color: '#1890ff',
      fontWeight: theme.typography.fontWeightMedium,
      background: "#303030",
      // border:'1px dashed #212121'
    },
  },
  selected: {},
}))((props) => {
  const classes = useStylesTab();

  return (
    <Tab
    style={{textDecoration:'none'}}
      disableRipple
      {...props}
      classes={{
        selected: classes.selected,
      }}
    />
  );
});

export default function Navbar(props) {
  let location = useLocation();
  let word = location.pathname.slice(1);
  if (location.pathname.slice(1).indexOf("/") !== -1) {
    const end = location.pathname.slice(1).indexOf("/");
    word = location.pathname.slice(1, end + 1);
  }

  if (location.pathname.length === 1) {
    word = "moneymkt";
  }
  console.log("word", word, tabs.map((t) => t.toLowerCase()).indexOf(word));
  const classes = useStyles();
  const [value, setValue] = React.useState(
    tabs.map((t) => t.toLowerCase()).indexOf(word)
  );
  console.log("classes", tabs.map((t) => t.toLowerCase()).indexOf(word));

  const handleChange = (event, newValue) => {
    console.log("new", newValue);
    setValue(newValue);
  };

  console.log("onConnect", props.onConnect);

  return (
    <div className={classes.root}>
      <Toolbar
        component="nav"
        variant="regular"
        className={classes.toolbar}
        style={{
          boxShadow: "none",
          borderBottom: "2px solid #192b38",
          background: "#0f1a22",
          minHeight: 30,
          minWidth: "100vw",
        }}
      >
        <Box className={classes.navs}>
          <Box
            component={Link}
            to="/moneymkt/3m"
            className={classes.navs}
            style={{ width: 250 }}
          >
            <img src={logobtnb} alt="logo" style={{ width: 190 }} />
            {/* <Avatar
                alt="Secured Finance"
                src={logo}
                className={classes.logo}
              />
              <Button>
                <Typography variant="h6" className={classes.title}>
                  Secured Finance
                </Typography>
              </Button> */}
          </Box>
        </Box>

        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
          component={"div"}
          className={classes.navs}
        >
          {tabs.map((tab) => (
            <StyledTab
              label={tab}
              {...a11yProps(0)}
              key={tab}
              component={Link}
              to={`/${tab.toLowerCase()}`}
            />
          ))}
        </StyledTabs>
        <div>
          {props.account ? (
            <Tooltip title={props.account} arrow>
              <Button
                color="primary"
                variant="outlined"
                disableFocusRipple
                disableElevation
                disableRipple
              >
                {props.account.slice(0, 3) + ".." + props.account.slice(-2)}
              </Button>
            </Tooltip>
          ) : (
            <Button
              style={{ textTransform: "capitalize" }}
              onClick={props.onConnect}
              variant="contained"
              color="primary"
            >
              Connect
            </Button>
          )}
        </div>
      </Toolbar>
    </div>
  );
}

Navbar.propTypes = {};
