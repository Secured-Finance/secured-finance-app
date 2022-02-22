import React from 'react';
import styled from 'styled-components';
import theme from '../../../../../theme';
import { percentFormat } from '../../../../../utils';

interface SpreadProps {
    spread: number;
    rate: number;
}

const Spread: React.FC<SpreadProps> = ({ spread, rate }) => {
    return (
        <StyledSpreadContainer>
            <StyledSpreadInfoContainer>
                <StyledSpreadItemText>Spread</StyledSpreadItemText>
                <StyledSpreadItemText
                    color={theme.colors.white}
                    fontSize={theme.sizes.body}
                    marginTop={4}
                    fontWeight={500}
                >
                    {percentFormat(spread)}
                </StyledSpreadItemText>
            </StyledSpreadInfoContainer>
            <StyledSpreadInfoContainer>
                <StyledSpreadItemText>Market Rate</StyledSpreadItemText>
                <StyledSpreadItemText
                    color={theme.colors.green}
                    fontSize={theme.sizes.body}
                    textAlign={'right'}
                    marginTop={4}
                    fontWeight={500}
                >
                    {percentFormat(rate)}
                </StyledSpreadItemText>
            </StyledSpreadInfoContainer>
        </StyledSpreadContainer>
    );
};

const StyledSpreadContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background: ${props => props.theme.colors.darkSection};
    padding: 7px 15px 5px;
    margin-left: -15px;
    margin-right: -15px;
`;

const StyledSpreadInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

interface StyledSpreadItemTextProps {
    color?: string;
    fontSize?: number;
    textAlign?: string;
    marginTop?: number;
    fontWeight?: number;
}

const StyledSpreadItemText = styled.p<StyledSpreadItemTextProps>`
    font-size: ${props =>
        props.fontSize ? props.fontSize : theme.sizes.caption5}px;
    font-weight: ${props => (props.fontWeight ? props.fontWeight : 400)};
    color: ${props => (props.color ? props.color : theme.colors.cellKey)};
    text-align: ${props => (props.textAlign ? props.textAlign : 'left')};
    margin: 0;
    margin-top: ${props => (props.marginTop ? props.marginTop : 0)}px;
`;

export default Spread;
