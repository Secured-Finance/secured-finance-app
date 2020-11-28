import React from "react";
import OrderType from "./OrderType";

export default function OrderBook() {
  const data = [...Array(6)].map((d, i) => {
    const amountval = 2000 - i * 100;

    return {
      price: { value: 0.1, label: "eth" },
      amount: { value: amountval, label: "fil" },
    };
  });

  return (
    <div className="orderbook">
      <h6 className="orderbook__title">Order book</h6>
      <div className="orderbook__heads">
        <div className="orderbook__head">Price</div>
        <div className="orderbook__head">Amount</div>
      </div>
      <OrderType type={{ side: "b", text: "Buy orders" }} orders={data} />
      <OrderType
        type={{ side: "r", text: "Sell orders" }}
        orders={data.reverse()}
      />
    </div>
  );
}
