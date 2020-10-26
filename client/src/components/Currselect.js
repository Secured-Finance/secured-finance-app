import React from "react";

export default function Currselect(props) {
  return (
    <select
      name="currentCurrency"
      id="currentCurrency"
      value={props.currentCurrency}
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
      onChange={props.onChange}
    >
      <option value="1">FIL</option>
      <option value="0">ETH</option>
      <option value="2">USDC</option>
    </select>
  );
}
