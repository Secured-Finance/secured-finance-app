import React from 'react';
import { useSelector } from 'react-redux';
import { Currency } from 'src/utils';
import styled from 'styled-components';
import { Subheader } from '../../../../components/common/Subheader';
import {
    useBorrowOrderbook,
    useLendOrderbook,
} from '../../../../hooks/useLendingOrderbook';
import { RootState } from '../../../../store/types';
import OrderType from './components/OrderType';
import Spread from './components/Spread';

export const OrderBook: React.FC = () => {
    const selectedCcy = useSelector(
        (state: RootState) => state.lendingTerminal.selectedCcy
    );
    const selectedTerms = useSelector(
        (state: RootState) => state.lendingTerminal.selectedTerms
    );
    const spread = useSelector(
        (state: RootState) => state.lendingTerminal.spread
    );
    const marketRate = useSelector(
        (state: RootState) => state.lendingTerminal.marketRate
    );

    const borrowOrderbook = useBorrowOrderbook(
        selectedCcy ? (selectedCcy as Currency) : Currency.ETH,
        selectedTerms
    );
    const lendOrderbook = useLendOrderbook(
        selectedCcy ? (selectedCcy as Currency) : Currency.ETH,
        selectedTerms
    );

    return (
        <StyledOrderBook>
            <Subheader>Order Book</Subheader>
            <OrderType
                type={{ side: 'lend', text: 'Lenders' }}
                showHeader={true}
                orders={lendOrderbook}
            />
            <Spread spread={spread} rate={marketRate} />
            <OrderType
                type={{ side: 'borrow', text: 'Borrowers' }}
                showHeader={false}
                orders={borrowOrderbook}
            />
        </StyledOrderBook>
    );
};

const StyledOrderBook = styled.div`
    display: grid;
`;
