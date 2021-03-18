import React, { useContext, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import theme from '../../../../theme';
import Button from '../../../../components/Button';
import Borrow from './components/Borrow';
import Lend from './components/Loan';
import { Subheader } from "../../../../components/common/Subheader";

const LoanOrder: React.FC = () => {
    const ordersTabs = ["Lend", "Borrow"];
    const [selectedTab, setSelectedTab] = useState("Lend")

    const handleChange = (tab: React.SetStateAction<string>) => () => {
        setSelectedTab(tab);
    };

    return (
        <StyledLoanOrder>
            <Subheader>Place Order</Subheader>
            <StyledLoanOrderButtons>
                {ordersTabs.map((tab, i) => (
                    <Button
                        key={i}
                        style={{
                            background: selectedTab === tab ? theme.colors.darkSection : 'transparent',
                            color: theme.colors.white,
                            textTransform: 'capitalize',
                            fontWeight: 600,
                            fontSize: 11,
                            outline: "none",
                            height: 42,
                            borderRadius: 0.5,
                            marginRight: 0,
                            width: '50%',
                            textAlign: "center",
                            paddingLeft: 15,
                            paddingRight: 15,
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

const StyledLoanOrderButtons = styled.div`
	display: flex;
	flex-direction: row;
	text-transform: uppercase;
	padding: 0;
    margin-bottom: ${(props) => props.theme.sizes.callout}px;
    margin-top: 0;
`

export default LoanOrder