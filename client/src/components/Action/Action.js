import { makeStyles, TextField } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import "./action.css";

const Type = styled.div`
  text-transform: uppercase;
  font-weight: bold;
  text-align: center;
`;

export default function Action({ children, btn,bgColor }) {
  let btnBgColor

  if(bgColor==="primary"){
    btnBgColor="blue"
  } else {
    btnBgColor="red"
    
  }
  return (
    <div className="action">
      <Type>{children}</Type>
      <div className="rates">
        <TextField
          variant="outlined"
          size="small"
          color="primary"
          label="Rates"
          fullWidth
        />
      </div>
      <div className="amount">
        <TextField variant="outlined" size="small" fullWidth label="Amount" />
      </div>
      <div>
        <button className={`bg-${btnBgColor}-600 text-white rounded-sm px-5 py-2 w-full `}>
          {btn}
        </button>
      </div>
    </div>
  );
}
