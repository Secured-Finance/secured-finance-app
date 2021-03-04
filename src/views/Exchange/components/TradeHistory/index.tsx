import React from "react"
import styled from "styled-components";
import TradesTable from "./TradesTable"
import { Trades } from "./types";

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
            <StyledTradeHistoryTitle>Trade History</StyledTradeHistoryTitle>
            <TradesTable trades={testData} />
        </StyledTradeHistory>
    );
}

const StyledTradeHistory = styled.div`
    display: grid;
`

const StyledTradeHistoryTitle = styled.h6`
	text-transform: capitalize;
    font-size: ${(props) => props.theme.sizes.caption}px;
    margin-bottom: ${(props) => props.theme.sizes.caption3}px;
    margin-top: ${(props) => props.theme.sizes.callout}px;
    font-weight: 600;
    line-height: 15px;
    color: ${props => props.theme.colors.white};
`