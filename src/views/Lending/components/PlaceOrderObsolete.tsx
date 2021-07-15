import React, { useContext, useState } from 'react';
import styled, { ThemeContext } from 'styled-components';
import theme from '../../../theme';
import Button from '../../../components/Button';
import Borrow from './Borrow';
import Lend from './Lend';

interface PlaceOrderProps {
    borrowRates: any[];
    lendingRates: any[];
}

const PlaceOrderObsolete: React.FC<PlaceOrderProps> = ({
    borrowRates,
    lendingRates,
}) => {
    const ordersTabs = ['Lend', 'Borrow'];
    const [selectedTab, setSelectedTab] = useState('Lend');

    const handleChange = (tab: React.SetStateAction<string>) => () => {
        setSelectedTab(tab);
    };

    return (
        <StyledLoanOrder>
            <StyledLoanOrderButtons>
                {ordersTabs.map((tab, i) => (
                    <Button
                        key={i}
                        style={{
                            background: 'transparent',
                            color: theme.colors.lightText,
                            borderBottom:
                                selectedTab === tab
                                    ? theme.colors.orange
                                    : 'none',
                            textTransform: 'capitalize',
                            fontWeight: 500,
                            fontSize: 16,
                            outline: 'none',
                            height: 55,
                            borderRadius: 1,
                            marginRight: 0,
                            width: '120px',
                            textAlign: 'center',
                            paddingLeft: 18,
                            paddingRight: 18,
                        }}
                        onClick={handleChange(tab)}
                    >
                        {tab}
                    </Button>
                ))}
            </StyledLoanOrderButtons>
            {selectedTab === 'Lend' ? (
                <Lend lendingRates={lendingRates} />
            ) : (
                <Borrow borrowRates={borrowRates} />
            )}
        </StyledLoanOrder>
    );
};

const StyledLoanOrder = styled.div`
    border: 1px solid ${props => props.theme.colors.darkenedBg};
    margin-top: ${props => props.theme.spacing[3]}px;
    display: flex;
    flex-direction: column;
    border-radius: 3px;
    max-width: 420px;
`;

const StyledLoanOrderButtons = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    text-transform: uppercase;
    padding: 0;
`;

export default PlaceOrderObsolete;
