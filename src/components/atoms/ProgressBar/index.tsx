import React from 'react';
import styled from 'styled-components';

interface ProgressBarProps {
    width: number;
    percent: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    width,
    percent = 0,
}) => {
    const [complete, setComplete] = React.useState(0);

    React.useEffect(() => {
        setComplete((percent / 100) * width);
    });

    return (
        <StyledProgressBar width={width}>
            <StyledProgress width={complete} />
        </StyledProgressBar>
    );
};

interface StylesProps {
    width: number;
}

const StyledProgressBar = styled.div<StylesProps>`
    background-color: ${props => props.theme.colors.darkenedBg};
    border-radius: 20px;
    width: ${props => props.width}px;
`;

const StyledProgress = styled.div<StylesProps>`
    background-color: ${props => props.theme.colors.blue};
    border-radius: 20px;
    width: ${props => props.width}px;
    height: 10px;
    transition: 1s ease;
    transition-delay: 0.5s;
`;
