import React from 'react';
import styled from 'styled-components';

interface ModalTitleProps {
    text?: string;
}

const ModalTitle: React.FC<ModalTitleProps> = ({ text }) => (
    <StyledModalTitle>{text}</StyledModalTitle>
);

const StyledModalTitle = styled.div`
    align-items: center;
    color: ${props => props.theme.colors.lightText};
    display: flex;
    font-size: 18px;
    font-weight: 500;
    height: ${props => props.theme.topBarSize}px;
    justify-content: center;
`;

export default ModalTitle;
