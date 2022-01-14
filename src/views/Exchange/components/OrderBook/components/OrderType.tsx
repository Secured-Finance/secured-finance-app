import React from "react";
import styled from "styled-components";
import { OrderbookRow } from "../../../../../store/lendingTerminal";
import theme from "../../../../../theme";
import { ordinaryFormat, percentFormat, usdFormat } from "../../../../../utils";
import { Type } from "../types";

interface OrderTypeProps {
    type: Type,
    orders: Array<OrderbookRow>
    showHeader: boolean
}

const OrderType: React.FC<OrderTypeProps> = ({ orders, type, showHeader }) => {
    const rows = orders.map(({ rate, totalAmount, usdAmount }, i) => {
        const w = `${0 + totalAmount / 50}%`;
        const bgColor = type.side === "lend" ? "#E46D53" : "#3A80AB";
        const txtColor = type.side === "lend" ? theme.colors.red3 : theme.colors.green;

        return (
            <StyledOrderRow key={i}>
                <StyledOrderRowText textColor={txtColor}>
                    {percentFormat(rate, 10000)}
                </StyledOrderRowText>
                <StyledOrderRowText textAlign={"right"}>
                    {ordinaryFormat(totalAmount)}
                </StyledOrderRowText>
                <StyledOrderRowText textAlign={"right"}>
                    {usdFormat(usdAmount)}
                </StyledOrderRowText>
                {/* <StyledOrderRowProgress
                    width={w}
                    background={bgColor}
                ></StyledOrderRowProgress> */}
            </StyledOrderRow>
        );
    });

    return (
        <StyledOrderType>
            {
                showHeader
                ?
                <StyledOrderBookHeader>
                    <StyledOrderBookHeaderItem>Rate (%)</StyledOrderBookHeaderItem>
                    <StyledOrderBookHeaderItem textAlign={"right"}>Amount (FIL)</StyledOrderBookHeaderItem>
                    <StyledOrderBookHeaderItem textAlign={"right"}>Total (USD)</StyledOrderBookHeaderItem>
                </StyledOrderBookHeader>
                :
                null
            }
            <StyledOrderRows showHeader={showHeader}>{rows}</StyledOrderRows>
        </StyledOrderType>
    );
}

const StyledOrderType = styled.div`
    margin-bottom: ${(props) => props.theme.spacing[2]}px;;
`

interface StyledOrderRowsProps {
    showHeader?: boolean
}

const StyledOrderRows = styled.div<StyledOrderRowsProps>`
    div:first-child {
        margin-top: ${(props) => props.showHeader ? 0 : props.theme.spacing[2]}px;
    }
`

const StyledOrderRow = styled.div`
	text-transform: uppercase;
    display: grid;
    position: relative;
    padding-top: ${(props) => props.theme.spacing[1]}px;
	padding-bottom: ${(props) => props.theme.spacing[1]}px;
	grid-template-columns: 1fr 1.5fr 1.5fr;
    font-size: ${(props) => props.theme.sizes.caption3}px;
`

interface StyledOrderRowTextProps {
    textColor?: string
    textAlign?: string
}

const StyledOrderRowText = styled.p<StyledOrderRowTextProps>`
    color: ${(props) => props.textColor? props.textColor : theme.colors.white};
    font-weight: 500;
    text-align: ${(props) => props.textAlign ? props.textAlign : "left"};
    z-index: 2;
    margin: 0;
`

interface StyledOrderRowProgressProps {
	background: string,
	width: string,
}

const StyledOrderRowProgress = styled.div<StyledOrderRowProgressProps>`
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	background-color: ${(props) => props.background};
	width: ${(props) => props.width};
	opacity: 0.15;
`

const StyledOrderBookHeader = styled.div`
    text-transform: uppercase;
    display: grid;
	grid-template-columns: 1fr 1.5fr 1.5fr;
    font-size: ${(props) => props.theme.sizes.caption5}px;
    padding: 6px 0;
`

interface StyledOrderBookHeaderItemProps {
    textAlign?: string
}

const StyledOrderBookHeaderItem = styled.div<StyledOrderBookHeaderItemProps>`
    color: ${(props) => props.theme.colors.cellKey};
    text-align: ${(props) => props.textAlign ? props.textAlign : "left"};
`

export default OrderType