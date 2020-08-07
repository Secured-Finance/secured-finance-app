import React, { useContext, useState } from 'react';
import { PGContext } from '../App';
import { CreateToken } from 'slate-react-system';

export default function Createtokenx() {
  const powergate = useContext(PGContext);
  const [token, settoken] = useState(null);

  const _handleCreateToken = async () => {
    const FFS = await powergate.pg.ffs.create();
    const token = FFS.token ? FFS.token : null;
    powergate.setTkn(token);
    powergate.pg.setToken(token);
    window.localStorage.setItem('pgtoken',token)
    settoken(token);
  };

  console.log('aaa', powergate, token, typeof token);

  return <CreateToken token={token} onClick={_handleCreateToken} />;
}
