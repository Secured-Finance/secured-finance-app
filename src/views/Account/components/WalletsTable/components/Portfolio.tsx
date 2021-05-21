import React from 'react';
import styled from 'styled-components';
import ProgressBar from '../../../../../components/ProgressBar';
import { percentFormat } from '../../../../../utils/formatNumbers';

interface PortfolioContainerProps {
    share: number;
}

const RenderPortfolio: React.FC<PortfolioContainerProps> = ({ share = 0 }) => {
    return (
        <StyledPortfolio>
            <StyledPortfolioInfoContainer>
                <ProgressBar width={120} percent={share} />
                <StyledPortfolioText>
                    {share != null ? percentFormat(share) : 0}
                </StyledPortfolioText>
            </StyledPortfolioInfoContainer>
        </StyledPortfolio>
    );
};

const StyledPortfolio = styled.div`
    font-size: ${props => props.theme.sizes.subhead}px;
    align-items: center;
    display: flex;
    justify-content: center;
    margin: 0 auto;
`;

const StyledPortfolioText = styled.div`
    margin-top: 5px;
    font-size: ${props => props.theme.sizes.subhead}px;
    color: ${props => props.theme.colors.white};
    font-weight: 500;
`;

const StyledPortfolioInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

export default RenderPortfolio;
