import React, { useState } from 'react';
import Button from '../Button';
import styled, { ThemeContext } from 'styled-components';
import { Link, useRouteMatch } from 'react-router-dom';
import theme from '../../theme';

interface TermsProps {
    tabs?: Array<string>;
}

const Terms: React.FC<TermsProps> = () => {
    const testTabs = ['1mo', '3mo', '6mo', '1yr', '2yr', '5yr'];
    const [tabValue, setTabValue] = useState('3mo');
    const { url } = useRouteMatch();

    const handleChange = (tab: React.SetStateAction<string>) => () => {
        setTabValue(tab);
    };

    return (
        <StyledTermsContainer>
            {testTabs.map((tab, i) => (
                <Button
                    key={i}
                    style={{
                        background: tabValue === tab ? '#4B94C2' : '#172734',
                        color: theme.colors.white,
                        fontSize: 12,
                        outline: 'none',
                        height: 25,
                        borderRadius: 3,
                        marginRight: 5,
                        fontWeight: 500,
                        paddingLeft: 10,
                        paddingRight: 10,
                        width: 'unset',
                        textTransform: 'lowercase',
                        textAlign: 'center',
                    }}
                    size='xs'
                    onClick={handleChange(tab)}
                >
                    {tab}
                </Button>
            ))}
        </StyledTermsContainer>
    );
};
export default Terms;

const StyledTermsContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;
