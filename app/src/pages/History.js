import React, { useContext, useEffect, useState } from 'react';
import { Paper, Container, makeStyles } from '@material-ui/core';
import { ContractContext } from '../App';
import MUIDataTable from 'mui-datatables';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import CopyClip from './CopyClip';
import Side from './Side';


const columns = [
  {
    name: 'Lender',
    label: 'Lender',
    options: {
      customBodyRender: (value, tableMeta, updateValue) => (
        <CopyClip value={value} label={shortenEthAddr(value)}></CopyClip>
      ),
    },
  },
  {
    name: 'Borrower',
    label: 'Borrower',
    options: {
      customBodyRender: (value, tableMeta, updateValue) => (
        <CopyClip value={value} label={shortenEthAddr(value)}></CopyClip>
      ),
    },
  },
  {
    name: 'Side',
    label: 'Side',
    options: {
      customBodyRender: (value, tableMeta, updateValue) => (
        <Side side={value}></Side>
      ),
    },
  },
  {
    name: 'Ccy',
    label: 'Ccy',
    options: {
      customBodyRender: (value, tableMeta, updateValue) => {
        const ccys=['ETH','FIL']

        return ccys[value]
      },
    },
  },
  {
    name: 'Term',
    label: 'Term',
    options: {
      customBodyRender: (value, tableMeta, updateValue) => {
        const terms=['3m','6m','1y','2y','3y','5y']

        return terms[value]
      },
    },
  },
  'Amount',
  {
    name: 'Rate',
    label: 'Rate',
    options: {
      customBodyRender: (value, tableMeta, updateValue) => {        

        return `${value/100}%`
      },
    },
  },
  'Schedule',
  'PV',
  {
    name: 'AsOf',
    label: 'AsOf',
    options: {
      customBodyRender: (value, tableMeta, updateValue) => {        

        return new Date(Number(value)).toString()
      },
    },
  },
  'Available',
  'State',
];

const data = [];

const options = {
  filterType: 'dropdown',
  // resizableColumns: true
};

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(4),
  },
}));

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
          console.log('hhh', lbs);
        } catch (error) {
          console.log('hhh err');
        }
      }
    })();

    return () => {};
  }, [loanContract, count]);

  return (
    <Container className={classes.root}>
      <MUIDataTable
        title={'Loan Book'}
        data={loanBooks}
        columns={columns}
        options={options}
      />
    </Container>
  );
}

// 0xdC4B87B1b7a3cCFb5d9e85C09a59923C0F6cdAFc

function shortenEthAddr(addr) {
  if (typeof addr !== 'string') return 'xx..xx';
  return addr.slice(0, 4) + '..' + addr.slice(-2);
}
