import React, { Fragment } from 'react';
import { Button, Container } from '@material-ui/core';
import NavBar from './NavBar';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import MoneyMKT from './pages/MoneyMKT';
import Swap from './pages/Swap';
import Fx from './pages/Fx';
import Book from './pages/Book';
import History from './pages/History';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const useStyles = makeStyles((theme) => ({
 container:{
   marginTop:theme.spacing(2)
 }
}));

const tabs = ['MoneyMKT', 'Swap', 'FX', 'Book', 'History'];

const routes = tabs.map((t) => t.toLowerCase());

function App() {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <NavBar />
        <Container className={classes.container}>
          <Redirect to="/moneymkt/3m" />

          <Switch>
            <Route path="/moneymkt">
              <MoneyMKT />
            </Route>
            <Route path="/swap">
              <Swap />
            </Route>
            <Route path="/fx">
              <Fx />
            </Route>
            <Route path="/book">
              <Book />
            </Route>
            <Route path="/history">
              <History />
            </Route>
          </Switch>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}
