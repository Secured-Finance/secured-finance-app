import React, { useState } from 'react';
import styled from 'styled-components';
import Borrow from './components/Borrow';
import Lend from './components/Loan';
import { Subheader } from '../../../../components/common/Subheader';
import { Tabs } from '../../../../components/common/Tabs';

const LoanOrder: React.FC = () => {
    const ordersTabs = ['Lend', 'Borrow'];
    const [selectedTab, setSelectedTab] = useState('Lend');

    return (
        <StyledLoanOrder>
            <Subheader>Place Order</Subheader>
            <StyledLoanOrderButtons>
                <Tabs
                    options={ordersTabs}
                    selectedTab={selectedTab}
                    onClick={setSelectedTab}
                />
            </StyledLoanOrderButtons>
            {selectedTab === 'Lend' ? <Lend /> : <Borrow />}
            {/* <OrderType type={{ side: "b", text: "Lenders" }} orders={testData} />
            <OrderType type={{ side: "r", text: "Borrowers" }} orders={testData} /> */}
        </StyledLoanOrder>
    );
};

const StyledLoanOrder = styled.div`
    margin-top: ${props => props.theme.spacing[3]}px;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const StyledLoanOrderButtons = styled.div`
    display: flex;
    flex-direction: row;
    padding: 0;
    margin-bottom: ${props => props.theme.sizes.callout}px;
    margin-top: 0;
`;

export default LoanOrder;
