import { makeStyles, TextField } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import "./action.css";

const Type = styled.div`
  text-transform: uppercase;
  font-weight: bold;
  text-align: center;
  font-size: 14px;
`;

const useStyles = makeStyles((theme) => ({
  textField:{
    height:10,
    background:'red'
  }
}));

export default function Action({ children, btn, bgColor }) {
  const classes=useStyles()
  let btnBgColor;

  if (bgColor === "primary") {
    btnBgColor = "blue";
  } else {
    btnBgColor = "red";
  }
  return (
    <div className="action">
      <Type>{children}</Type>
      <div className="rates">
        <TextField variant="outlined" size="small" label="Rates" fullWidth 
          classes={classes.textField}
          margin="dense"
        />
      </div>
      <div className="amount">
        <TextField variant="outlined" size="small" fullWidth label="Amount"  margin="dense"/>
      </div>
      <div>
        <button
          className={`bg-${btnBgColor}-600 text-white rounded-sm px-5 py-2 w-full `}
        >
          {btn}
        </button>
      </div>
    </div>
  );
}
