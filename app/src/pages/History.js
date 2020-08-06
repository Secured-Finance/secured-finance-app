import React, { useContext, useEffect } from 'react';
import { Paper, Container, makeStyles } from '@material-ui/core';
import { ContractContext } from '../App';

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

  useEffect(() => {
    (async () => {
      if (loanContract) {
        try {
          const loan = await loanContract.methods.getOneBook(account).call();
          console.log('hhh', loan);
        } catch (error) {
          console.log('hhh err')
        }
      }
    })();

    return () => {};
  }, [loanContract, count]);

  return (
    <Container className={classes.root}>
      <Paper className={classes.paper}>HH</Paper>
    </Container>
  );
}
