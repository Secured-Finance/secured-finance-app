import React from 'react';
import { useParams } from 'react-router-dom';
import {
  makeStyles,
  Container,
  Grid,
  Typography,
  Box,
} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
  },
  boderX:{
    background:"red"
  }
}));

export default function Duration(props) {
  let { duration } = useParams();
  const classes = useStyles();

  console.log('Duration', duration);

  return (
    <div>
      
    </div>
  );
}
