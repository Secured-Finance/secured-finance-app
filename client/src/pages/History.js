import React, { useContext, useEffect, useState } from "react";
import { Paper, Container, makeStyles } from "@material-ui/core";
import { ContractContext } from "../App";
import MUIDataTable, { TableFilterList } from "mui-datatables";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CopyClip from "./CopyClip";
import Side from "./Side";
import Schedule from "./Schedule";
import moment from "moment";
import CustomToolbar from "./CustomToolbar";
import Chip from "@material-ui/core/Chip";
import EnhancedTable from "../components/EnhancedTable";

const CustomChip = ({ label, onDelete }) => {
  return "xxxx";
  return (
    <Chip
      variant="outlined"
      color="secondary"
      label={label}
      onDelete={onDelete}
    />
  );
};

const CustomFilterList = (props, x) => {
  return <TableFilterList {...props} ItemComponent={CustomChip} />;
};

const STATE = [
  "REGISTERED",
  "WORKING",
  "DUE",
  "PAST_DUE",
  "CLOSED",
  "TERMINATED",
];

const columns = [
  {
    name: "Lender",
    label: "Lender",
    options: {
      customBodyRender: (value, tableMeta, updateValue) => (
        <CopyClip value={value} label={shortenEthAddr(value)}></CopyClip>
      ),
    },
  },
  {
    name: "Borrower",
    label: "Borrower",
    options: {
      customBodyRender: (value, tableMeta, updateValue) => (
        <CopyClip value={value} label={shortenEthAddr(value)}></CopyClip>
      ),
    },
  },
  {
    name: "Side",
    label: "Side",
    options: {
      customBodyRender: (value, tableMeta, updateValue) => (
        <Side side={value}></Side>
      ),
    },
  },
  {
    name: "Ccy",
    label: "Ccy",
    options: {
      customBodyRender: (value, tableMeta, updateValue) => {
        const ccys = ["ETH", "FIL"];

        return ccys[value];
      },
    },
  },
  {
    name: "Term",
    label: "Term",
    options: {
      customBodyRender: (value, tableMeta, updateValue) => {
        const terms = ["3m", "6m", "1y", "2y", "3y", "5y"];

        return (
          <div
            style={{
              color: "orange",
              border: "1px solid orange",
              textAlign: "center",
            }}
          >
            {terms[value]}
          </div>
        );
      },
    },
  },
  "Amount",
  {
    name: "Rate",
    label: "Rate",
    options: {
      customBodyRender: (value, tableMeta, updateValue) => {
        return `${(value / 100).toFixed(2)}%`;
      },
    },
  },
  {
    name: "Schedule",
    label: "Schedule",
    options: {
      customBodyRender: (value, tableMeta, updateValue) => {
        if (value.length) {
          const start = moment.unix(value[0]).format("DD/MM/YYYY");
          const end = moment.unix(value[1]).format("DD/MM/YYYY");
          return (
            <Schedule
              start={start}
              values={{
                start,
                end,
                notices: value[2],
                payments: value[3],
                amounts: value[4],
              }}
            />
          );
        }

        return null;
      },
    },
  },
  "PV",
  {
    name: "AsOf",
    label: "AsOf",
    options: {
      customBodyRender: (value, tableMeta, updateValue) => {
        return moment.unix(value).format("DD/MM/YYYY");
      },
    },
  },
  {
    name: "Available",
    label: "Available",
    options: {
      customBodyRender: (value, tableMeta, updateValue) => {
        let style = {
          width: 15,
          height: 15,
          borderRadius: "50%",
          textAlign: "center",
        };
        if (value) {
          style = { ...style, background: "green" };
        } else {
          style = { ...style, background: "red" };
        }

        return (
          <div
            style={style}
            title={value ? "available" : "not available"}
          ></div>
        );
      },
    },
  },
  {
    name: "State",
    label: "State",
    options: {
      customBodyRender: (value, tableMeta, updateValue) => {
        return <div style={{ fontSize: "0.6rem" }}>{STATE[value]}</div>;
      },
    },
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(4),
  },
}));

const LOAN_BOOKS=[
  {

  }
]

export default function History(props) {
  const { count } = props;
  const classes = useStyles();
  const contract = useContext(ContractContext);
  const { loanContract, account } = contract;
  const [loanBooks, setloanBooks] = useState([]);

  useEffect(() => {
    (async () => {
      if (loanContract) {
        try {
          const lbs = await loanContract.methods.getOneBook(account).call();
          setloanBooks(lbs[0]);
        } catch (error) {}
      }
    })();

    return () => {};
  }, [loanContract, count]);

  const options = {
    filterType: "dropdown",
    // customToolbar: () => {
    //   return <CustomToolbar data={loanBooks} columns={columns} />;
    // },
    selectableRows: false ,
    customToolbar:()=>null,
    download:false,
    print:false,
    // resizableColumns: true
  };

  console.log('lll',loanBooks);

  return (
    <Container className={classes.root}>
      <div id="loanbook">
        <MUIDataTable
          title={"Trade History"}
          data={loanBooks}
          columns={columns}
          options={options}
          components={{
            TableFilterList: CustomFilterList,
          }}
        />
      </div>
    </Container>
  );
}

// 0xdC4B87B1b7a3cCFb5d9e85C09a59923C0F6cdAFc

function shortenEthAddr(addr) {
  if (typeof addr !== "string") return "xx..xx";
  return addr.slice(0, 4) + ".." + addr.slice(-2);
}
