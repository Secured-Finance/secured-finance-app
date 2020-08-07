import React, { useState, useContext } from 'react';
import { SendAddressFilecoin } from 'slate-react-system';
import { PGContext } from '../App';

export default function SendAddressFilecoinx() {
  const powergate = useContext(PGContext);
  const [succ, setsucc] = useState(false);

  const _handleSend = async ({ source, target, amount }) => {
    const res = await powergate.pg.ffs.sendFil(
      powergate.address,
      target,
      amount,
    );
    setsucc(true);
  };

  return (
    <React.Fragment>
      <SendAddressFilecoin onSubmit={_handleSend} />
      {succ ? (
        <div style={{ background: 'green', padding: 10, margin: 10 }}>
          SUCCESS!
        </div>
      ) : null}
    </React.Fragment>
  );
}
