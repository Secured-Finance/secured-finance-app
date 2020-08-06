import React, { useState, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';

import axios from 'axios';
import Pinata from './Pinata';

import domtoimage from 'dom-to-image';
import cryptoRandomString from 'crypto-random-string';
import {
  Snackbar,
  Box,
  CircularProgress,
  Typography,
  LinearProgress,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

const defaultToolbarStyles = {
  iconButton: {},
};

const testAuthentication = () => {
  console.log('testAuthentication start');
  const url = `https://api.pinata.cloud/data/testAuthentication`;
  return axios
    .get(url, {
      headers: {
        pinata_api_key: 'd653cd95e0dc829f4ea6',
        pinata_secret_api_key:
          'a0fb1a8a6c7d3a6638aa6d4c9e8f70a4db11e9f7e86b93345f260914e5ffe288',
      },
    })
    .then(function (response) {
      //handle your response here
      console.log('testAuthentication', response);
    })
    .catch(function (error) {
      //handle error here
    });
};

const pinfiletoipfs = (blob) => {
  console.log('pinfiletoipfs start');
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  let data = new FormData();
  data.append('file', blob);

  const metadata = JSON.stringify({
    name: `loanbook_${cryptoRandomString({ length: 20 })}`,
    keyvalues: {
      exampleKey: 'exampleValue',
    },
  });
  data.append('pinataMetadata', metadata);

  const pinataOptions = JSON.stringify({
    cidVersion: 0,
    customPinPolicy: {
      regions: [
        {
          id: 'FRA1',
          desiredReplicationCount: 1,
        },
        {
          id: 'NYC1',
          desiredReplicationCount: 2,
        },
      ],
    },
  });
  data.append('pinataOptions', pinataOptions);

  return axios
    .post(url, data, {
      maxContentLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: 'd653cd95e0dc829f4ea6',
        pinata_secret_api_key:
          'a0fb1a8a6c7d3a6638aa6d4c9e8f70a4db11e9f7e86b93345f260914e5ffe288',
      },
    })
    .then(function (response) {
      //handle your response here
      console.log('pinfiletoipfs', response);
      return response;
    })
    .catch(function (error) {
      //handle error here
    });
};
function CustomToolbar(props) {
  const [cid, setcid] = useState('');
  const [loading, setloading] = useState(false);
  const [style, setstyle] = useState({});
  const [open, setOpen] = React.useState(false);
  //https://gateway.pinata.cloud/ipfs/
  //IpfsHash

  const handlePinata = () => {
    // testAuthentication();
    setloading(true);

    domtoimage
      .toBlob(document.getElementById('loanbook'))
      .then(function (blob) {
        console.log('blob', blob);

        pinfiletoipfs(blob).then((res) => {
          setOpen(true);
          setcid(res.data.IpfsHash);
          setloading(false);
        });
      });
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const { classes } = props;

  useEffect(() => {
    let id = null;
    if (loading) {
      id = setInterval(() => {
        setstyle({ backgroundColor: getRandomColor() });
      }, 300);
    }

    return () => {
      clearInterval(id);
    };
  }, [loading]);

  return (
    <React.Fragment>
      <Tooltip title={'Pinata Cloud'}>
        <IconButton
          className={classes.iconButton}
          onClick={handlePinata}
          style={{ position: 'relative', outline: 'none' }}
        >
          {loading && (
            <LinearProgress
              style={{
                position: 'absolute',
                right: 0,
                left: 0,
                bottom: 0,
                ...style,
              }}
            />
          )}

          {/* <AddIcon className={classes.deleteIcon} /> */}
          <Pinata />
        </IconButton>
      </Tooltip>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="success">
          Pinata Cloud IPFS:{' '}
          <a href={`https://gateway.pinata.cloud/ipfs/${cid}`} target="_blank">
            Click Here! - {cid}
          </a>
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default withStyles(defaultToolbarStyles, { name: 'CustomToolbar' })(
  CustomToolbar,
);
