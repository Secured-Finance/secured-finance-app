import React from 'react';

const SIDE = ['lend', 'borrow'];

export default function Side(props) {
  console.log("ssidee",typeof props.side,props.side);
  if (parseInt(props.side) === 0) {
    return <div style={{ color: 'green' }}>L</div>;
  } else if (parseInt(props.side) === 1) {
    return <div style={{ color: 'red' }}>B</div>;
  }

  return <div>NONE</div>;
}
