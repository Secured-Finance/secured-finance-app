import React from 'react';
import styled from 'styled-components';

interface ContainerProps {
    children?: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ children }) => {
    return <StyledContainer>{children}</StyledContainer>;
};

const StyledContainer = styled.div<ContainerProps>`
    box-sizing: border-box;
    margin: 0 auto;
    // background-color: ${props => props.theme.background};
    padding: 0 ${props => props.theme.spacing[4]}px;
    width: 100%;
`;
