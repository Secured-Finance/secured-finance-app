import "../styles/global.css";
import React, { useEffect, Fragment } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Navbar from "../components/NavBar/NavBar";
import {
  createMuiTheme,
  ThemeProvider,
  makeStyles,
} from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

export default function App({ Component, pageProps }) {
  useEffect(() => {
    console.log("INIITIal");
    return () => {};
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Component {...pageProps} ok={"okthen"} />
    </ThemeProvider>
  );
}
