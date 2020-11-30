import Button from "@material-ui/core/Button";

import React, { useState } from "react";
import { Link, useRouteMatch } from "react-router-dom";

const tabs = ["1mo", "3mo", "6mo", "1yr", "2yr", "3yr", "5yr"];

export default function Terms() {
  const [tabValue, settabValue] = useState("3mo")
  let { url } = useRouteMatch();
  
  const handleChange = (tab) => () => {
    settabValue(tab);
  };

  return (
    <div >
      {tabs.map((tab, i) => (
        <Button
          key={i}
          style={{
            background: tabValue === tab ? "#4B94C2" : "#172734",
            fontSize: 12,
            outline: "none",
            minWidth: 30,
            height: 30,
            borderRadius: 0,
            marginRight: 5,
            textTransform:"lowercase",
          }}
          size="small"
          onClick={handleChange(tab)}
          component={Link}
          to={`${url}/${tab.toLowerCase()}`}
        >
          {tab}
        </Button>
      ))}
    </div>
  );
}
