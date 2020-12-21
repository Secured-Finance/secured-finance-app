import React, { useContext, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import theme from '../../theme';
import Button from '../Button';
import Borrow from './components/Borrow';
import Lend from './components/Loan';

const LoanOrder: React.FC = () => {
    const ordersTabs = ["Lend", "Borrow"];
    const [selectedTab, setSelectedTab] = useState("Lend")

    const handleChange = (tab: React.SetStateAction<string>) => () => {
        setSelectedTab(tab);
    };

    return (
        <StyledLoanOrder>
            <StyledLoanOrderTitle>Place Order</StyledLoanOrderTitle>
            <StyledLoanOrderButtons>
                {ordersTabs.map((tab, i) => (
                    <Button
                        key={i}
                        style={{
                            background: selectedTab === tab ? '#0F1D25': 'transparent',
                            color: selectedTab === tab ? theme.colors.white : theme.colors.lightText,
                            textTransform: 'uppercase',
                            fontWeight: 600,
                            fontSize: 14,
                            outline: "none",
                            height: 42,
                            borderRadius: 3,
                            marginRight: 5,
                            width: 'unset',
                            textAlign: "center",
                            paddingLeft: 18,
                            paddingRight: 18,
                        }}
                        onClick={handleChange(tab)}
                    >
                        {tab}
                    </Button>
                ))}
            </StyledLoanOrderButtons>
                { selectedTab === "Lend" ? <Lend /> :<Borrow /> }
            {/* <OrderType type={{ side: "b", text: "Lenders" }} orders={testData} />
            <OrderType type={{ side: "r", text: "Borrowers" }} orders={testData} /> */}
        </StyledLoanOrder>
    );
}

const StyledLoanOrder = styled.div`
    margin-top: ${(props) => props.theme.spacing[3]}px;
    display: flex;
    flex-direction: column;
    justify-content: center;
`

const StyledLoanOrderTitle = styled.div`
    text-transform: uppercase;
    font-size: ${(props) => props.theme.sizes.subhead}px;
    margin-bottom: ${(props) => props.theme.sizes.caption3}px;
    margin-top: 0px;
    font-weight: 600;
    color: ${props => props.theme.colors.white};
`

const StyledLoanOrderButtons = styled.div`
	display: flex;
	flex-direction: row;
	text-transform: uppercase;
	padding: 0;
`

export default LoanOrder