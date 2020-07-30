import React, { useState } from 'react';
import {
  Container,
  Paper,
  makeStyles,
  Grid,
  Input,
  Button,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
}));

export default function Book() {
  const classes = useStyles();
  const [b3m, setb3m] = useState('');
  const [l3m, setl3m] = useState('');
  const [a3m, seta3m] = useState('');
  const [b6m, setb6m] = useState('');
  const [l6m, setl6m] = useState('');
  const [a6m, seta6m] = useState('');
  const [b1y, setb1y] = useState('');
  const [l1y, setl1y] = useState('');
  const [a1y, seta1y] = useState('');
  const [b2y, setb2y] = useState('');
  const [l2y, setl2y] = useState('');
  const [a2y, seta2y] = useState('');
  const [b3y, setb3y] = useState('');
  const [l3y, setl3y] = useState('');
  const [a3y, seta3y] = useState('');

  return (
    <Paper className={classes.root}>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={10}>
            <Grid container spacing={3}>
              <Grid item xs={2}></Grid>
              <Grid item xs={3}>
                <div style={{ fontSize: '1.2rem' }}>Borrow</div>
              </Grid>
              <Grid item xs={3}>
                <div style={{ fontSize: '1.2rem' }}>Lend</div>
              </Grid>
              <Grid item xs={3}>
                <div style={{ fontSize: '1.2rem' }}>Amount</div>
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid
                item
                xs={2}
                justify="flex-end"
                container
                alignItems="center"
              >
                3m
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    setb3m(Number(e.target.value));
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={b3m}
                />
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    setl3m(Number(e.target.value));
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={l3m}
                />
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    seta3m(Number(e.target.value));
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={a3m}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={2} justify="flex-end" container>
                6m
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    setb6m(Number(e.target.value));
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={b6m}
                />
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    setl6m(Number(e.target.value));
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={l6m}
                />
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    seta6m(Number(e.target.value));
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={a6m}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={2} justify="flex-end" container>
                1y
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    setb1y(Number(e.target.value));
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={b1y}
                />
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    setl1y(Number(e.target.value));
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={l1y}
                />
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    seta1y(Number(e.target.value));
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={a1y}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={2} justify="flex-end" container>
                2y
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    setb2y(Number(e.target.value));
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={b2y}
                />
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    setl2y(Number(e.target.value));
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={l2y}
                />
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    seta2y(Number(e.target.value));
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={a2y}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={2} justify="flex-end" container>
                3y
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    setb3y(Number(e.target.value));
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={b3y}
                />
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    setl3y(Number(e.target.value));
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={l3y}
                />
              </Grid>
              <Grid item xs={3}>
                <Input
                  onChange={(e) => {
                    seta3y(Number(e.target.value));
                  }}
                  inputProps={{ 'aria-label': 'description' }}
                  value={a3y}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={2} container justify="center" direction="column">
            <div>
              <div style={{ marginBottom: 20 }}>
                <Button variant="contained" color="primary">
                  Buy FIL
                </Button>
              </div>
              <div>
                <Button variant="contained" color="secondary">
                  Sell FIL
                </Button>
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>
    </Paper>
  );
}
