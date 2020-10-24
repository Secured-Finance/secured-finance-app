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
import { useRouter } from "next/router";
import Link from "next/link";

// const logo = require("../../static/logo.jpeg");
// const logobtnb = require("../../public/images/logobtnb.png");
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
}))((props) => <Tab disableRipple {...props} />);

export default function Navbar(props) {
  const router = useRouter();

  const classes = useStyles();

  const [tabIndex, settabIndex] = useState(0);

  const changeRoute = (tab, index) => () => {
    router.push(tab);

    settabIndex(index);
  };

  console.log("onConnect", props.onConnect);

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Toolbar component="nav" variant="regular" className={classes.toolbar}>
          <Box className={classes.navs} style={{ marginRight: 10, width: 250 }}>
            <img src={"/logobtnb.png"} alt="logo" style={{ width: 200 }} />
            {/* <Avatar
                alt="Secured Finance"
                src={"/logobtn.png"}
                className={classes.logo}
              /> */}
            {/* <Button>
                <Typography variant="h6" className={classes.title}>
                  Secured Finance
                </Typography>
              </Button> */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <select
                name=""
                id=""
                value={props.currentCurrency}
                style={{ height: 25, outline: "none", marginTop: 5 }}
                onChange={(e) => {
                  props.setCurrentCurrency(e.target.value);
                }}
              >
                <option value="1">FIL</option>
                <option value="0">ETH</option>
              </select>
            </div>
          </Box>

          <StyledTabs
            value={tabIndex}
            aria-label="simple tabs example"
            component={"div"}
            className={classes.navs}
          >
            {tabs.map((tab, i) => (
              <StyledTab
                label={tab}
                {...a11yProps(i)}
                key={tab}
                onClick={changeRoute(`/${tab.toLowerCase()}`, i)}
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
      </AppBar>
    </div>
  );
}

Navbar.propTypes = {};
