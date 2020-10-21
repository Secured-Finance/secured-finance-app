import React, { useState, useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Tooltip from '@material-ui/core/Tooltip';

export default function CopyClip(props) {
  const [copied, setcopied] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setcopied(false);
    }, 3000);
  }, [copied]);

  let el;

  if (copied) {
    el = (
      <Tooltip title="Copied" placement="right">
        <CopyToClipboard
          text={props.value}
          onCopy={() => setcopied(true)}
          style={{ cursor: 'pointer' }}
        >
          <span>{props.label}</span>
        </CopyToClipboard>
      </Tooltip>
    );
  } else {
    el = (
      <Tooltip title={props.value} placement="bottom" enterDelay={700}>
        <CopyToClipboard
          text={props.value}
          onCopy={() => setcopied(true)}
          style={{ cursor: 'pointer' }}
        >
          <span>{props.label}</span>
        </CopyToClipboard>
      </Tooltip>
    );
  }

  return el;
}
