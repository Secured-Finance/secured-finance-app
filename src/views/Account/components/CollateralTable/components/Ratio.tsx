import React from 'react';
import styled from 'styled-components';
import { colors } from '../../../../../theme/colors';
import { percentFormat } from '../../../../../utils/formatNumbers';

interface RatioContainerProps {
    ratio: number;
}

const RenderRatio: React.FC<RatioContainerProps> = ({ ratio }) => {
    let textColor: string;

    if (ratio < 125 && ratio > 0) {
        textColor = colors.red;
    } else if (ratio >= 125 && ratio < 150) {
        textColor = colors.yellow;
    } else if (ratio >= 150) {
        textColor = colors.green;
    }

    return (
        <StyledRatio>
            <StyledRatioText color={textColor}>
                {ratio != null ? percentFormat(ratio) : 0}
            </StyledRatioText>
        </StyledRatio>
    );
};

const StyledRatio = styled.div`
    font-size: ${props => props.theme.sizes.subhead}px;
    align-items: center;
    display: flex;
    justify-content: center;
    margin: 0 auto;
`;

interface RatioTextProps {
    color?: string;
}

const StyledRatioText = styled.div<RatioTextProps>`
    font-size: ${props => props.theme.sizes.subhead}px;
    color: ${props => (props.color ? props.color : props.theme.colors.white)};
    font-weight: 500;
`;

export default RenderRatio;
