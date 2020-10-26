import React from "react";

export default function Currselect(props) {
  return (
    <select
      name="currentCurrency"
      id="currentCurrency"
      value={props.currentValue}
      onChange={props.onChange}
      style={{
        height: 25,
        outline: "none",
        background: "#172734",
        border: "1px solid #192b38",
        color: "white",
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderColor: "#192b38",
        fontWeight: "bold",
      }}
    >
      {props.values.map((value, i) => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </select>
  );
}

Currselect.defaultProps = {
  values: ["FIL", "ETH", "USDC"],
  currentValue: "FIL",
};
