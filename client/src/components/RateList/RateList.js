import React from "react";
import style from './RateList.module.css'

const rates = [
  { token: "ETH", lend: 7.0, borrow: 9.0 },
  { token: "FIL", lend: 8.0, borrow: 10.0 },
  { token: "USDC", lend: 2.24, borrow: 4.32 },
];

export default function RateList() {
  return (
    <div className={style["rate-list"]}>
      <div>FIL/ETH</div>
      <div className={style.search}>
        <input placeholder="search token" class=" px-2 text-white border-2 rounded-lg border-blue-600 focus:border-blue-400 focus:outline-none w-64 h-8 bg-transparent" />
      </div>
      <div className={style['rate-table']}>
        <div className={style.head}>TOKEN</div>
        <div className={style.head}>LEND</div>
        <div className={style.head}>BORROW</div>
        {rates.map((rate, i) => {
          return (
            <React.Fragment key={i}>
              <div className="token">{rate.token}</div>
              <div className="lend">{rate.lend}</div>
              <div className="borrow">{rate.borrow}</div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
