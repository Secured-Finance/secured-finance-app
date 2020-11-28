import React from "react";
import clsx from "clsx";

export default function OrderType({ type, orders }) {
  const rows = orders.map(({ price, amount }, i) => {
    const w = type.side === "b" ? `${100 - i * 10}%` : `${(i + 1) * 10}%`;
    const bgColor = type.side === "b" ? "#3A80AB" : "#E46D53";

    return (
      <div className="order_row" key={i}>
        <div className="order_amount">
          {amount.value} {amount.label}
        </div>
        <div className="order_price">
          {price.value} {price.label}
        </div>
        <div
          className="order_progress"
          style={{ width: w, backgroundColor: bgColor }}
        ></div>
      </div>
    );
  });

  return (
    <div className="order-type">
      <div
        className={clsx("order-type_title", {
          "order-type_title--b": type.side === "b",
          "order-type_title--r": type.side === "r",
        })}
      >
        {type.text}
      </div>
      <div className="order_rows">{rows}</div>
    </div>
  );
}
