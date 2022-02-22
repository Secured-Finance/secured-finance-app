import React from 'react';
import styled from 'styled-components';
import TradesTable from './TradesTable';
import { Subheader } from '../../../../components/common/Subheader';
import theme from '../../../../theme';
import { useLendingTradingHistory } from '../../../../hooks/useLendingOrderbook';
import { RootState } from '../../../../store/types';
import { useSelector } from 'react-redux';

export const TradeHistory: React.FC = () => {
    const ccyIndex = useSelector(
        (state: RootState) => state.lendingTerminal.currencyIndex
    );
    const termsIndex = useSelector(
        (state: RootState) => state.lendingTerminal.termsIndex
    );

    const tradeHistory = useLendingTradingHistory(ccyIndex, termsIndex);

    return (
        <StyledTradeHistory>
            <Subheader>Trade History</Subheader>
            <TradesTable trades={tradeHistory} />
        </StyledTradeHistory>
    );
};

const StyledTradeHistory = styled.div`
    display: grid;
    margin-top: ${theme.spacing[3]}px;
`;
