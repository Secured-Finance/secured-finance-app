import React from "react"
import styled from "styled-components";
import OrderType from "./components/OrderType"
import Spread from "./components/Spread";
import { Type, Orders } from './types'
import { Subheader } from "../../../../components/common/Subheader"

interface OrderBookProps {
    buyType: Type,
    buyOrders?: Array<Orders>,
    sellType: Type,
    sellOrders?: Array<Orders>,
}

export const OrderBook: React.FC = () => {
    const testData = [...Array(10)].map((d, i) => {
        const basisAmount = 3500 - i * 300;
        const basisTotal = basisAmount * 42.56;
        const basisRate = 7.1 + i * 0.23;
    
        return {
          amount: basisAmount,
          rate: basisRate,
          total: basisTotal,
        }
    })

    const reversedTestData =  [].concat(testData).reverse()
    
    return (
        <StyledOrderBook>
            <Subheader>Order Book</Subheader>
            <OrderType type={{ side: "lend", text: "Lenders" }} showHeader={true} orders={reversedTestData} />
            <Spread spread={0.25} rate={7.1}/>
            <OrderType type={{ side: "borrow", text: "Borrowers" }} showHeader={false} orders={testData} />
        </StyledOrderBook>
    );
}

const StyledOrderBook = styled.div`
    display: grid;
`