import React from 'react';
import styled from 'styled-components';

interface CardIconProps {
    children?: React.ReactNode;
}

const CardIcon: React.FC<CardIconProps> = ({ children }) => (
    <StyledCardIcon>{children}</StyledCardIcon>
);

const StyledCardIcon = styled.div`
    background-color: ${props => props.theme.colors.darkenedBg};
    font-size: 48px;
    height: 80px;
    width: 80px;
    border-radius: 40px;
    align-items: center;
    display: flex;
    justify-content: center;
    margin: 0 auto;
`;

export default CardIcon;
