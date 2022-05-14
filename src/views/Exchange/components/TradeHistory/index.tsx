import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Subheader } from '../../../../components/common/Subheader';
import { useLendingTradingHistory } from '../../../../hooks/useLendingOrderbook';
import { RootState } from '../../../../store/types';
import theme from '../../../../theme';
import TradesTable from './TradesTable';

export const TradeHistory: React.FC = () => {
    const { selectedCcy, selectedTerms } = useSelector(
        (state: RootState) => state.lendingTerminal
    );

    const tradeHistory = useLendingTradingHistory(selectedCcy, selectedTerms);

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
