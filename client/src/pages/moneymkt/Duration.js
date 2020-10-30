import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  makeStyles,
  Container,
  Grid,
  Typography,
  Box,
  Button,
} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import ReactVirtualizedTable from "./component/ReactVirtualizedTable";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    paddingTop: theme.spacing(5),
    flexGrow: 1,
    textAlign: "center",
    minHeight: "75vh",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  midPrice: {
    fontSize: "1rem",
    border: "1px dashed white",
    padding: theme.spacing(1),
    fontWeight: theme.typography.fontWeightBold,
    textAlign: "center",
  },
  row: {
    borderBottom: "2px solid #192b38",
    paddingTop: 15,
    paddingBottom: 15,
  },
  even: {
    background: "#172734",
  },
  odd: {
    background: "#0f1a22",
  },
  tbcontainer: {
    maxHeight: 320,
  },
}));

//del
const type = {
  b: "Borrow",
  l: "Lend",
};

export default function Duration(props) {
  const [selRo, setselRo] = useState({});
  let { duration } = useParams();
  const classes = useStyles();
  const { orderbook, currentMidrate, setcurrType, setselectedRow } = props;

  const borrows = orderbook.borrowerbook.sort((a, b) => a.rate - b.rate);
  const lends = orderbook.lenderbook.sort((a, b) => b.rate - a.rate);

  const average = borrows.length ? (borrows[0].rate + lends[0].rate) / 2 : 0;

  const selRow = (rowData) => {
    setselectedRow(rowData);
  };

  const clickRo = (r, i) => () => {
    setselRo({ ...r, i });
  };

  const testRows = [1, 2, 3, 4, 5];

  return (
    <div className={classes.root}>
      <Container>
        <div style={{ textAlign: "left", marginBottom: 20 }}>
          {type[props.currType] + " Rates"}
        </div>
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
                <TableCell className={classes.row}>PeerID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {testRows.map((row, i) => (
                <TableRow
                  key={i}
                  onClick={clickRo(row, i)}
                  style={{
                    outline: selRo.i === i ? "1px solid #4b94c2" : "none",
                  }}
                >
                  <TableCell
                    className={clsx(classes.row, {
                      [classes.even]: i % 2 === 0,
                      [classes.odd]: i % 2 !== 0,
                    })}
                  >
                    {"10,000 FIL"}
                  </TableCell>
                  <TableCell
                    className={clsx(classes.row, {
                      [classes.even]: i % 2 === 0,
                      [classes.odd]: i % 2 !== 0,
                    })}
                  >
                    {"8.10%"}
                  </TableCell>
                  <TableCell
                    className={clsx(classes.row, {
                      [classes.even]: i % 2 === 0,
                      [classes.odd]: i % 2 !== 0,
                    })}
                  >
                    {"0x92..E3"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div style={{ marginTop: 20 }}>
          <Button
            variant="contained"
            disableRipple
            disableFocusRipple
            size="large"
            style={{
              background: "#d6735a",
              color: "white",
              textTransform: "capitalize",
            }}
          >
            {type[props.currType]}
          </Button>
        </div>
      </Container>
      {/* <Grid container spacing={3}>
        {/* <Grid item xs={12}>
          <div className={classes.midPrice}>{currentMidrate}%</div>
        </Grid> */}
      {/* <Grid item xs={6}>
        <div style={{ fontSize: "1.5rem" }}>Borrowersx</div>
        <ReactVirtualizedTable
          rows={borrows}
          columns={[
            {
              width: 100,
              label: "Amount",
              dataKey: "amount",
              flexGrow: 1,
            },
            {
              width: 120,
              label: "Rate %",
              dataKey: "rate",
              numeric: true,
            },
          ]}
          type={"lend"}
          onRowClick={selRow}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setcurrType("lend");
          }}
        >
          Lend
        </Button>
      </Grid>
      <Grid item xs={6}>
        <div style={{ fontSize: "1.5rem" }}>Lenders</div>
        <ReactVirtualizedTable
          rows={lends}
          columns={[
            {
              width: 100,
              label: "Amount",
              dataKey: "amount",
              flexGrow: 1,
            },
            {
              width: 120,
              label: "Rate %",
              dataKey: "rate",
              numeric: true,
            },
          ]}
          onRowClick={selRow}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setcurrType("borrow");
          }}
        >
          Borrow
        </Button>
      </Grid> */}
      {/* </Grid> */}
    </div>
  );
}
