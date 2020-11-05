import React, { useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Container,
  Grid,
  makeStyles,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableContainer,
} from "@material-ui/core";
import SwapHorizontalCircleIcon from "@material-ui/icons/SwapHorizontalCircle";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useLocation,
  useRouteMatch,
  Redirect,
} from "react-router-dom";
import clsx from "clsx";
import { Line } from "react-chartjs-2";

const tabs = ["1m", "3m", "6m", "1y", "2y", "3y", "5y"];

const useStyles = makeStyles((theme) => ({
  row: {
    borderBottom: "2px solid #192b38",
    paddingTop: 10,
    paddingBottom: 10,
    background: "#122735",
    fontSize: 12,
  },

  tbcontainer: {
    maxHeight: 260,
  },
}));

export default function Swap() {
  const [tabValue, setTabValue] = React.useState("3m");
  let { url } = useRouteMatch();
  const classes = useStyles();

  const handleChange = (tab) => () => {
    setTabValue(tab);
  };

  const data = {
    labels: ["0", "3m", "6m", "1y", "2y", "3y", "5y"],
    datasets: [
      {
        label: "FIL Borrow",
        fill: false,
        lineTension: 0,
        backgroundColor: "white",
        borderColor: "lightblue",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "lightblue",
        pointBackgroundColor: "white",
        pointBorderWidth: 1,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "lightblue",
        pointHoverBorderWidth: 1.5,
        pointRadius: 1.7,
        pointHitRadius: 5,
        data: [8, 10, 7, 8, 10, 9, 7],
        borderWidth: 0.5,
      },
      {
        label: "USDC Lend",
        fill: false,
        lineTension: 0,
        backgroundColor: "white",
        borderColor: "yellow",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "yellow",
        pointBackgroundColor: "white",
        pointBorderWidth: 1,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "yellow",
        pointHoverBorderWidth: 1.5,
        pointRadius: 1.7,
        pointHitRadius: 5,
        data: [0.22, 0.24, 0.26, 0.28, 0.32, 0.34, 0.48],
        borderWidth: 0.5,
      },
      {
        label: "FIL-USDC Spread",
        fill: false,
        lineTension: 0,
        backgroundColor: "white",
        borderColor: "purple",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "purple",
        pointBackgroundColor: "white",
        pointBorderWidth: 1,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "purple",
        pointHoverBorderWidth: 1.5,
        pointRadius: 1.7,
        pointHitRadius: 5,
        data: [7, 8, 6, 7, 9, 6, 8],
        borderWidth: 0.5,
      },
    ],
  };

  const [selIndLeft, setselIndLeft] = useState(null);
  const [selIndRight, setselIndRight] = useState(null);
  const [selRowLeft, setselRowLeft] = useState({});
  const [selRowRight, setselRowRight] = useState({});

  const rowSelect = (row, i, setselInd, setselRow) => () => {
    setselInd(i);
    setselRow(row);
  };

  return (
    <div style={{ marginTop: 50 }}>
      <Container>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 28, marginRight: 22 }}>
            Cross Currency Swap
          </div>
          <div>
            {tabs.map((tab, i) => (
              <Button
                key={i}
                style={{
                  background: tabValue === tab ? "#4B94C2" : "#172734",
                  fontSize: 12,
                  outline: "none",
                  minWidth: 30,
                  height: 30,
                  borderRadius: 0,
                  marginRight: 5,
                }}
                size="small"
                onClick={handleChange(tab)}
                component={Link}
                to={`${url}/${tab.toLowerCase()}`}
              >
                {tab}
              </Button>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 44 }}>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <div style={{ display: "flex", marginBottom: 33, fontSize: 20 }}>
                <div style={{ marginRight: 30 }}>Exchange</div>
                <div
                  style={{
                    color: "#35759d",
                    borderBottom: "1px solid #35759d",
                    fontWeight: "bold",
                    marginRight: 30,
                  }}
                >
                  10.000
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <select
                    name="currentCurrency"
                    id="currentCurrency"
                    value={"1"}
                    style={{
                      height: 25,
                      outline: "none",
                      background: "#172734",
                      border: "1px solid #192b38",
                      color: "white",
                      borderTopLeftRadius: 5,
                      borderTopRightRadius: 5,
                      borderColor: "#192b38",
                      fontWeight: "bold",
                      marginRight: 30,
                    }}
                    onChange={(e) => {
                      // props.setCurrentCurrency(e.target.value);
                    }}
                  >
                    <option value="1">FIL</option>
                    <option value="0">ETH</option>
                    <option value="2">USDC</option>
                  </select>
                </div>
                <div style={{ marginRight: 30 }}>for</div>
                <div
                  style={{
                    color: "#35759d",
                    borderBottom: "1px solid #35759d",
                    fontWeight: "bold",
                    marginRight: 30,
                  }}
                >
                  30.000
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <select
                    name="currentCurrency"
                    id="currentCurrency"
                    value={"2"}
                    style={{
                      height: 25,
                      outline: "none",
                      background: "#172734",
                      border: "1px solid #192b38",
                      color: "white",
                      borderTopLeftRadius: 5,
                      borderTopRightRadius: 5,
                      borderColor: "#192b38",
                      fontWeight: "bold",
                    }}
                    onChange={(e) => {
                      // props.setCurrentCurrency(e.target.value);
                    }}
                  >
                    <option value="1">FIL</option>
                    <option value="0">ETH</option>
                    <option value="2">USDC</option>
                  </select>
                </div>
              </div>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TableContainer className={classes.tbcontainer}>
                    <Table
                      stickyHeader
                      aria-label="sticky table"
                      className={classes.table}
                      size="small"
                      aria-label="a dense table"
                      style={{
                        border: "2px solid #1e3344",
                        borderRadiusTopLeft: 15,
                        borderRadiusTopRight: 15,
                      }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.row}>AMOUNT</TableCell>
                          <TableCell className={classes.row}>RATE</TableCell>
                          <TableCell className={classes.row}>RECEIVE</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {[1, 2, 3, 4, 5].map((row, i) => (
                          <TableRow
                            key={i}
                            onClick={rowSelect(
                              row,
                              i,
                              setselIndLeft,
                              setselRowLeft
                            )}
                          >
                            <TableCell
                              className={clsx(classes.row)}
                              style={{
                                borderBottom: "1px solid #1E4258",
                                background:
                                  selIndLeft === i ? "#21435A" : undefined,
                              }}
                            >
                              {"10,000 FIL"}
                            </TableCell>
                            <TableCell
                              className={clsx(classes.row)}
                              style={{
                                borderBottom: "1px solid #1E4258",
                                background:
                                  selIndLeft === i ? "#21435A" : undefined,
                              }}
                            >
                              {"8.10%"}
                            </TableCell>
                            <TableCell
                              className={clsx(classes.row)}
                              style={{
                                borderBottom: "1px solid #1E4258",
                                background:
                                  selIndLeft === i ? "#21435A" : undefined,
                              }}
                            >
                              {"810 FIL"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={6}>
                  <TableContainer className={classes.tbcontainer}>
                    <Table
                      stickyHeader
                      aria-label="sticky table"
                      className={classes.table}
                      size="small"
                      aria-label="a dense table"
                      style={{
                        border: "2px solid #1e3344",
                        borderRadiusTopLeft: 15,
                        borderRadiusTopRight: 15,
                      }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.row}>AMOUNT</TableCell>
                          <TableCell className={classes.row}>RATE</TableCell>
                          <TableCell className={classes.row}>PAY</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {[1, 2, 3, 4, 5].map((row, i) => (
                          <TableRow
                            key={i}
                            onClick={rowSelect(
                              row,
                              i,
                              setselIndRight,
                              setselRowRight
                            )}
                          >
                            <TableCell
                              className={clsx(classes.row)}
                              style={{
                                borderBottom: "1px solid #1E4258",
                                background:
                                  selIndRight === i ? "#21435A" : undefined,
                              }}
                            >
                              {"60,000 USDC"}
                            </TableCell>
                            <TableCell
                              className={clsx(classes.row)}
                              style={{
                                borderBottom: "1px solid #1E4258",
                                background:
                                  selIndRight === i ? "#21435A" : undefined,
                              }}
                            >
                              {"0.12%"}
                            </TableCell>
                            <TableCell
                              className={clsx(classes.row)}
                              style={{
                                borderBottom: "1px solid #1E4258",
                                background:
                                  selIndRight === i ? "#21435A" : undefined,
                              }}
                            >
                              {"72 USDC"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
              <div style={{ textAlign: "center", marginTop: 22 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SwapHorizontalCircleIcon />}
                  size="large"
                >
                  Swap
                </Button>
              </div>
            </Grid>
            <Grid item xs={6}>
              <Line
                data={data}
                options={{
                  legend: {
                    display: true,
                  },
                }}
              />
            </Grid>
          </Grid>
        </div>
      </Container>
    </div>
  );
}
