import { Button } from "@material-ui/core";
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import styled from "styled-components";
import Terms from "../Terms";

const bs = [0, 0.4, 0.6, 0.7, 0.75, 0.775, 0.79];
const ls = [0, 0.3, 0.4, 0.45, 0.475, 0.485, 0.491];
const ms = [];

for (let i = 0; i < bs.length; i++) {
  const x = (bs[i] + ls[i]) / 2;
  ms.push(x);
}

let data = {
  labels: ["0", "3m", "6m", "1y", "2y", "3y", "5y"],
  datasets: [
    {
      label: "Borrow",
      fill: true,
      lineTension: 0.2,
      backgroundColor: "rgb(214, 115, 90,0.1)",
      borderColor: "#d6735a",
      borderCapStyle: "butt",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      pointBorderColor: "#d6735a",
      pointBackgroundColor: "white",
      pointBorderWidth: 1,
      pointHoverRadius: 4,
      pointHoverBackgroundColor: "rgba(75,192,192,1)",
      pointHoverBorderColor: "#d6735a",
      pointHoverBorderWidth: 1.5,
      pointRadius: 1.7,
      pointHitRadius: 5,
      data: bs,
      borderWidth: 0.5,
      opacity: 0.1,
    },
    {
      label: "Lend",
      fill: true,
      lineTension: 0.2,
      backgroundColor: "rgb(62, 105, 137,0.5)",
      borderColor: "#3e6989",
      borderCapStyle: "butt",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      pointBorderColor: "#3e6989",
      pointBackgroundColor: "white",
      pointBorderWidth: 1,
      pointHoverRadius: 4,
      pointHoverBackgroundColor: "rgba(75,192,192,1)",
      pointHoverBorderColor: "#3e6989",
      pointHoverBorderWidth: 1.5,
      pointRadius: 1.7,
      pointHitRadius: 5,
      data: ls,
      borderWidth: 0.5,
    },
    {
      label: "Mid Price",
      fill: false,
      lineTension: 0.2,
      backgroundColor: "rgb(199, 149, 86,0.5)",
      borderColor: "#c79556",
      borderCapStyle: "butt",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      pointBorderColor: "#c79556",
      pointBackgroundColor: "white",
      pointBorderWidth: 1,
      pointHoverRadius: 4,
      pointHoverBackgroundColor: "rgba(75,192,192,1)",
      pointHoverBorderColor: "#c79556",
      pointHoverBorderWidth: 1.5,
      pointRadius: 1.7,
      pointHitRadius: 5,
      data: ms,
      borderWidth: 0.5,
    },
  ],
};

const Flex = styled.div`
  display: flex;
  padding-left: 26px;
`;

const Title = styled.div`
  font-weight: 400;
  font-size: 22px;
`;

export default function YieldCurve() {
  const [lineData, setlineData] = useState(data);

  const toggleLine = (i) => () => {
    const newlineData = { ...lineData };
    newlineData.datasets[i].hidden = !newlineData.datasets[i].hidden;
    setlineData(newlineData);
  };

  return (
    <div>
      <div className="flex justify-between px-4 py-2">
      <Title>FIL Yield Curve</Title>
      <Terms></Terms>
      </div>
      <Flex>
        <div>
          <button
            className={`bg-red-500 text-white text-sm rounded-sm px-3 py-1 m-0.5 focus:outline-none ${
              lineData.datasets[0].hidden === true ? "line-through" : "none"
            }`}
            onClick={toggleLine(0)}
          >
            borrow
          </button>
        </div>
        <div>
          <button
            className={`bg-blue-500 text-white text-sm rounded-sm px-3 py-1 m-0.5 focus:outline-none ${
              lineData.datasets[1].hidden === true ? "line-through" : "none"
            }`}
            onClick={toggleLine(1)}
          >
            lending
          </button>
        </div>
        <div>
          <button
            className={`bg-yellow-500 text-white text-sm rounded-sm px-3 py-1 m-0.5 focus:outline-none ${
              lineData.datasets[2].hidden === true ? "line-through" : "none"
            }`}
            onClick={toggleLine(2)}
          >
            mid price
          </button>
        </div>
      </Flex>
      <Line data={lineData} />
    </div>
  );
}
