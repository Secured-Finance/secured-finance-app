import React from 'react';
import { TextField, Button, Paper } from '@material-ui/core';
import SwapVertIcon from '@material-ui/icons/SwapVert';
export default function Swap() {
  return (
    <div style={{ textAlign: 'center', marginTop: 100,  }}>
      <Paper style={{ padding: 40, width:400,margin:'auto' }}>
        <div style={{ marginBottom: 10 }}>
          <TextField id="outlined-basic" label="FIL" variant="outlined" />
        </div>
        <div style={{ marginBottom: 10 }}>
          <SwapVertIcon></SwapVertIcon>
        </div>
        <div style={{ marginBottom: 20 }}>
          <TextField id="outlined-basic" label="ETH" variant="outlined" />
        </div>
        <div>
          <Button variant="contained" color="primary" size="large">
            SWAP
          </Button>
        </div>
      </Paper>
    </div>
  );
}
