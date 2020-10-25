import React, { useEffect, useContext, useState } from 'react';
import { CreateFilecoinAddress } from 'slate-react-system';
import { PGContext } from '../App';
// import { address } from 'ip';

export default function CreateFilecoinAddressx() {
  const powergate = useContext(PGContext);
  const [addr, setaddr] = useState(null);

  // useEffect(() => {
  //   (async ()=>{

  //   })()

  //   return () => {

  //   }
  // }, [])

  const _handleCreateAddress = async ({ name, type, makeDefault }) => {
    const response = await powergate.pg.ffs.newAddr(name, type, makeDefault);
    powergate.setaddress(response.addr);
    setaddr(response.addr);
    console.log('CreateFilecoinAddress',response);
  };

  return (
    <React.Fragment>
      <CreateFilecoinAddress onSubmit={_handleCreateAddress} />
      {addr ? <div style={{background:'green', padding:10,margin:10}}>{`Address is ${addr}`}</div> : null}
    </React.Fragment>
  );
}

// {
//   "addr": "t3qkprcntbhvurneoiryiocfawsaheotks26xh3psdvsts7dci34uzd4ol32nrtojdcglto3ca4zdx2vaauctq"
// }

// _handleCreateAddress = async ({ name, type, makeDefault }) => {
//   const response = await this.PG.ffs.newAddr(name, type, makeDefault);

//   const { addrsList } = await this.PG.ffs.addrs();
//   const { info } = await this.PG.ffs.info();
//   this.setState({ addrsList, info });
// };
