import React from 'react';
import styled from 'styled-components';

export const Breaker: React.FC = () => {
    return (
        <StyledBreakerContainer>
            <StyledBreak />
            <StyledBreakerText>Or</StyledBreakerText>
            <StyledBreak />
        </StyledBreakerContainer>
    );
};

const StyledBreakerContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-items: space-between;
    margin-top: 24px;
`;

const StyledBreak = styled.hr`
    flex: 1;
    margin: 0;
    border-style: solid;
    border-width: 1px;
    border-color: ${props => props.theme.colors.darkenedBg};
`;

const StyledBreakerText = styled.p`
    margin: 0 10px;
    text-align: center;
    color: ${props => props.theme.colors.gray};
    font-size: ${props => props.theme.sizes.footnote}px;
    text-transform: uppercase;
`;
