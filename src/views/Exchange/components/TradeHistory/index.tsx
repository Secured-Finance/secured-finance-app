import React from "react"
import styled from "styled-components";
import TradesTable from "./TradesTable"
import { Trades } from "./types";
import { Subheader } from "../../../../components/common/Subheader"
import theme from "../../../../theme"

export const TradeHistory: React.FC = () => {

    const generateRandomDOB = (): number => {
        const random = getRandomDate(new Date('2020-02-12T01:57:45.271Z'), new Date('2021-02-12T01:57:45.271Z'))
        return random.getTime();
    }
    
    function getRandomDate(from: Date, to: Date) {
        const fromTime = from.getTime();
        const toTime = to.getTime();
        return new Date(fromTime + Math.random() * (toTime - fromTime));
    }

    const testData = [...Array(10)].map((d, i) => {
        const basisAmount = 3500 - i * 300;
        const basisTime = generateRandomDOB();
        const basisRate = 7.1 + i * 0.23;
    
        return {
          rate: basisRate,
          amount: basisAmount,
          time: basisTime,
          side: Math.round(Math.random())
        }
    }) as Array<Trades>
    
    return (
        <StyledTradeHistory>
            <Subheader>Trade History</Subheader>
            <TradesTable trades={testData} />
        </StyledTradeHistory>
    );
}

const StyledTradeHistory = styled.div`
    display: grid;
    margin-top: ${theme.spacing[3]}px;
`
