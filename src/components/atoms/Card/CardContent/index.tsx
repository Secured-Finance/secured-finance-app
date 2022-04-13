import React from 'react';
import styled from 'styled-components';

export const CardContent: React.FC = ({ children }) => (
    <StyledCardContent>{children}</StyledCardContent>
);

const StyledCardContent = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: ${props => props.theme.spacing[3]}px;
`;
