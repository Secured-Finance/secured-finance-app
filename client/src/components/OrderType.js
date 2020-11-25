import React from "react";

export default function OrderType({ type, orders }) {
  const rows = orders.map(({ price, amount }, i) => {
    const w = type === "l" ? `${100 - i * 10}%` : `${(i + 1) * 10}%`;
    const bgColor = type === "l" ? "#3A80AB" : "#E46D53";

    return (
      <div className="order_row" key={i}>
        <div className="order_price">
          {price.value} {price.label}
        </div>
        <div className="order_amount">
          {amount.value} {amount.label}
        </div>
        <div
          className="order_progress"
          style={{ width: w, backgroundColor: bgColor }}
        ></div>
      </div>
    );
  });

  let title;

  if (type.toLowerCase() === "l") {
    title = <div className="order-type_title order-type_title--l">Lenders</div>;
  } else {
    title = <div className="order-type_title order-type_title--b">Borrowers</div>;

  }

  return (
    <div className="order-type">
      {title}
      <div className="order_rows">{rows}</div>
    </div>
  );
}
