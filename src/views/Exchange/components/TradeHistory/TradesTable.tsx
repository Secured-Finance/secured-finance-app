import React from 'react';
import styled from 'styled-components';
import { TradingHistoryRow } from '../../../../store/lendingTerminal';
import theme from '../../../../theme';
import { formatTime, ordinaryFormat, percentFormat } from '../../../../utils';

interface OrderTypeProps {
    trades: Array<TradingHistoryRow>;
}

const TradesTable: React.FC<OrderTypeProps> = ({ trades }) => {
    const rows = trades.map(({ rate, amount, createdAtTimestamp, side }, i) => {
        const txtColor = side === 0 ? theme.colors.red3 : theme.colors.green;

        return (
            <StyledOrderRow key={i}>
                <StyledOrderRowText textColor={txtColor}>
                    {percentFormat(rate, 10000)}
                </StyledOrderRowText>
                <StyledOrderRowText textAlign={'right'}>
                    {ordinaryFormat(amount)}
                </StyledOrderRowText>
                <StyledOrderRowText textAlign={'right'}>
                    {formatTime(createdAtTimestamp)}
                </StyledOrderRowText>
            </StyledOrderRow>
        );
    });

    return (
        <div>
            <StyledOrderBookHeader>
                <StyledOrderBookHeaderItem>Rate (%)</StyledOrderBookHeaderItem>
                <StyledOrderBookHeaderItem textAlign={'right'}>
                    Amount (FIL)
                </StyledOrderBookHeaderItem>
                <StyledOrderBookHeaderItem textAlign={'right'}>
                    Time
                </StyledOrderBookHeaderItem>
            </StyledOrderBookHeader>
            <div>{rows}</div>
        </div>
    );
};

const StyledOrderRow = styled.div`
    text-transform: uppercase;
    display: grid;
    position: relative;
    padding-top: ${props => props.theme.spacing[1]}px;
    padding-bottom: ${props => props.theme.spacing[1]}px;
    grid-template-columns: 1fr 1.5fr 1.5fr;
    font-size: ${props => props.theme.sizes.caption3}px;
`;

interface StyledOrderRowTextProps {
    textColor?: string;
    textAlign?: string;
}

const StyledOrderRowText = styled.p<StyledOrderRowTextProps>`
    color: ${props => (props.textColor ? props.textColor : theme.colors.white)};
    font-weight: 500;
    text-align: ${props => (props.textAlign ? props.textAlign : 'left')};
    z-index: 2;
    margin: 0;
`;

interface StyledOrderRowProgressProps {
    background: string;
    width: string;
}

const StyledOrderBookHeader = styled.div`
    text-transform: uppercase;
    display: grid;
    grid-template-columns: 1fr 1.5fr 1.5fr;
    font-size: ${props => props.theme.sizes.caption5}px;
    padding: 6px 0;
`;

interface StyledOrderBookHeaderItemProps {
    textAlign?: string;
}

const StyledOrderBookHeaderItem = styled.div<StyledOrderBookHeaderItemProps>`
    color: ${props => props.theme.colors.cellKey};
    text-align: ${props => (props.textAlign ? props.textAlign : 'left')};
`;

export default TradesTable;
