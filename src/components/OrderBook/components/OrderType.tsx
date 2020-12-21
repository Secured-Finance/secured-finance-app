import React from "react";
import styled from "styled-components";
import { Type, Orders } from "../types";

interface OrderTypeProps {
    type: Type,
    orders: Array<Orders>
}

const OrderType: React.FC<OrderTypeProps> = ({ orders, type }) => {
    const rows = orders.map(({ rate, amount }, i) => {
        const w = `${0 + amount.value / 50}%`;
        const bgColor = type.side === "b" ? "#3A80AB" : "#E46D53";

        return (
            <StyledOrderRow key={i}>
                <StyledOrderRowText style={{paddingLeft: '4px'}}>
                    {rate.value.toFixed(2)} {rate.label}
                </StyledOrderRowText>
                <StyledOrderRowText>
                    {amount.value.toFixed(2)} {amount.label}
                </StyledOrderRowText>
                <StyledOrderRowProgress
                    width={w}
                    background={bgColor}
                ></StyledOrderRowProgress>
            </StyledOrderRow>
        );
    });

    return (
        <StyledOrderType>
            <StyledTitle color={type.side === "b" ? "#3a80ab" : "#e46d53"}>
                {type.text}
            </StyledTitle>
			<StyledOrderBookHeader>
				<StyledOrderBookHeaderItem>Rate</StyledOrderBookHeaderItem>
				<StyledOrderBookHeaderItem>Amount</StyledOrderBookHeaderItem>
			</StyledOrderBookHeader>
            <StyledOrderRows>{rows}</StyledOrderRows>
        </StyledOrderType>
    );
}

const StyledOrderType = styled.div`
    margin-bottom: ${(props) => props.theme.spacing[4]}px;;
`

interface StyledTitleProps {
    color?: string,
}

const StyledTitle = styled.div<StyledTitleProps>`
    color: ${(props) => props.color};
    text-transform: uppercase;
	margin-bottom: ${(props) => props.theme.spacing[2]}px;
	// text-align: center;
	font-size: ${(props) => props.theme.sizes.body}px;
    font-weight: 500;
`

const StyledOrderRows = styled.div`
`

const StyledOrderRow = styled.div`
	text-transform: uppercase;
    display: grid;
    position: relative;
    padding-top: 0.5em;
	padding-bottom: 0.5em;
	grid-template-columns: repeat(1, 1fr 1fr);
    font-size: ${(props) => props.theme.sizes.caption}px;
`

const StyledOrderRowText = styled.div`
    color: ${(props) => props.theme.colors.white};
    font-weight: 500;
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
    grid-template-columns: repeat(1, 1fr 1fr);
    font-size: ${(props) => props.theme.sizes.subhead}px;
    margin-bottom: ${(props) => props.theme.spacing[1]}px;
`

const StyledOrderBookHeaderItem = styled.div`
    color: ${(props) => props.theme.colors.darkBlue};
`

export default OrderType