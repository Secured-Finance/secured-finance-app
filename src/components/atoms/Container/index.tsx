import React from 'react';
import styled from 'styled-components';

interface ContainerProps {
    children?: React.ReactNode;
    width?: number;
}

const Container: React.FC<ContainerProps> = ({ children, width }) => {
    return <StyledContainer width={width}>{children}</StyledContainer>;
};

interface StyledContainerProps {
    width: number;
}

const StyledContainer = styled.div<StyledContainerProps>`
    box-sizing: border-box;
    margin: 0 auto;
    // background-color: ${props => props.theme.background};
    padding: 0 ${props => props.theme.spacing[4]}px;
    width: 100%;
`;

export default Container;
