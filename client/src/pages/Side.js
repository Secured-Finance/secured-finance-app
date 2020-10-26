import React from 'react';

const SIDE = ['lend', 'borrow'];

export default function Side(props) {
  if (parseInt(props.side) === 0) {
    return <div style={{ color: 'green',fontWeight:"bold" }}>L</div>;
  } else if (parseInt(props.side) === 1) {
    return <div style={{ color: 'red',fontWeight:"bold" }}>B</div>;
  }

  return <div>NONE</div>;
}
