import React from 'react'
import styled from 'styled-components'
import { percentFormat, usdFormat } from '../../../../../utils/formatNumbers'

interface BorrowContainerProps {
    borrow: number,
    dailyChange: number,
}

const RenderBorrow: React.FC<BorrowContainerProps> = ({borrow, dailyChange}) => {
    return (
        <StyledBorrow>
            <StyledWalletInfoContainer>
                <StyledBorrowText>
                   up to { borrow != null ? usdFormat(borrow) : 0 }
                </StyledBorrowText>
                <StyledBorrowSubtitleContainer
                    >
                    { dailyChange != null && dailyChange > 0 
                    ? 
                    <StyledBorrowSubtitle>{dailyChange != null ? percentFormat(dailyChange): 0}</StyledBorrowSubtitle>
                    : 
                    <StyledBorrowSubtitleNegative>{dailyChange != null ? percentFormat(dailyChange): 0}</StyledBorrowSubtitleNegative>
                    }
                </StyledBorrowSubtitleContainer>
            </StyledWalletInfoContainer>
        </StyledBorrow>
    )
}

const StyledBorrow = styled.div`
    font-size: ${(props) => props.theme.sizes.subhead}px;
    align-items: center;
    display: flex;
    justify-content: center;
    margin: 0 auto;
`

const StyledBorrowText = styled.div`
    font-size: ${(props) => props.theme.sizes.body}px;
    color: ${(props) => props.theme.colors.white};
    font-weight: 500;
`

const StyledWalletInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`

const StyledBorrowSubtitleContainer = styled.div`
`

const StyledBorrowSubtitle = styled.p`
    margin: 0;
    margin-top: 2px;
    color: ${(props) => props.theme.colors.green};
    font-size: ${(props) => props.theme.sizes.caption}px;
    font-weight: 400;
`

const StyledBorrowSubtitleNegative = styled.p`
    margin: 0;
    margin-top: 2px;
    color: ${(props) => props.theme.colors.red};
    font-size: ${(props) => props.theme.sizes.caption}px;
    font-weight: 400;
`

export default RenderBorrow
