import React from "react"
import styled from "styled-components";
import OrderType from "./components/OrderType"
import { Type, Orders } from './types'

interface OrderBookProps {
    buyType: Type,
    buyOrders?: Array<Orders>,
    sellType: Type,
    sellOrders?: Array<Orders>,
}

export const OrderBook: React.FC = () => {
    const testData = [...Array(6)].map((d, i) => {
        const basisAmount = 2000 - i * 300;
        const basisRate = 7.1 + i * 0.23;
    
        return {
          amount: { value: basisAmount, label: "FIL" },
          rate: { value: basisRate, label: "%" },
        };
    });
    
    return (
        <StyledOrderBook>
            <StyledOrderBookTitle>Order book</StyledOrderBookTitle>
            <OrderType type={{ side: "b", text: "Lenders" }} orders={testData} />
            <OrderType type={{ side: "r", text: "Borrowers" }} orders={testData} />
        </StyledOrderBook>
    );
}

const StyledOrderBook = styled.div`
    display: grid;
`

const StyledOrderBookTitle = styled.h6`
    text-transform: uppercase;
    font-size: ${(props) => props.theme.sizes.subhead}px;
    margin-bottom: ${(props) => props.theme.sizes.caption3}px;
    margin-top: 0px;
    font-weight: 600;
    color: ${props => props.theme.colors.white};
`