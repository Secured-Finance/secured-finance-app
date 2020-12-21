import React from 'react'
import styled from 'styled-components'
import { percentFormat, usdFormat } from '../../../../../utils/formatNumbers'

interface PriceContainerProps {
    price: number,
    dailyChange: number,
}

const RenderPrice: React.FC<PriceContainerProps> = ({price, dailyChange}) => {
    return (
        <StyledPrice>
            <StyledWalletInfoContainer>
                <StyledPriceText
                >{ price != null ? usdFormat(price) : 0 }</StyledPriceText>
                <StyledPriceSubtitleContainer
                    >
                    { dailyChange != null && dailyChange > 0 
                    ? 
                    <StyledPriceSubtitle>{dailyChange != null ? percentFormat(dailyChange): 0}</StyledPriceSubtitle>
                    : 
                    <StyledPriceSubtitleNegative>{dailyChange != null ? percentFormat(dailyChange): 0}</StyledPriceSubtitleNegative>
                    }
                </StyledPriceSubtitleContainer>
            </StyledWalletInfoContainer>
        </StyledPrice>
    )
}

const StyledPrice = styled.div`
    font-size: ${(props) => props.theme.sizes.subhead}px;
    align-items: center;
    display: flex;
    justify-content: center;
    margin: 0 auto;
`

const StyledPriceText = styled.div`
    font-size: ${(props) => props.theme.sizes.body}px;
    color: ${(props) => props.theme.colors.white};
    font-weight: 500;
`

const StyledWalletInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`

const StyledPriceSubtitleContainer = styled.div`
`

const StyledPriceSubtitle = styled.p`
    margin: 0;
    margin-top: 2px;
    color: ${(props) => props.theme.colors.green};
    font-size: ${(props) => props.theme.sizes.caption}px;
    font-weight: 400;
`

const StyledPriceSubtitleNegative = styled.p`
    margin: 0;
    margin-top: 2px;
    color: ${(props) => props.theme.colors.red};
    font-size: ${(props) => props.theme.sizes.caption}px;
    font-weight: 400;
`

export default RenderPrice
