import React from 'react';
import styled from 'styled-components';

interface CardTitleProps {
    text?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ text }) => (
    <StyledCardTitle>{text}</StyledCardTitle>
);

const StyledCardTitle = styled.div`
    color: ${props => props.theme.colors.lightText};
    font-size: 16px;
    font-weight: 600;
    padding: ${props => props.theme.spacing[4]}px 0;
    text-align: center;
`;
