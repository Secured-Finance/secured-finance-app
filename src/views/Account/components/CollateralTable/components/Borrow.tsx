import React from 'react'
import styled from 'styled-components'
import { ordinaryFormat, percentFormat, usdFormat } from '../../../../../utils/formatNumbers'

interface BorrowContainerProps {
    borrow: number,
    value: number,
}

const RenderBorrow: React.FC<BorrowContainerProps> = ({borrow, value}) => {
    return (
        <StyledBorrow>
            <StyledWalletInfoContainer>
                <StyledBorrowText>
                   { borrow != null ? ordinaryFormat(borrow) : 0 } FIL
                </StyledBorrowText>
                <StyledBorrowSubtitleContainer
                    >
                    <StyledBorrowlSubtitle>
                        { value != null ? usdFormat(value) : 0 }
                    </StyledBorrowlSubtitle>
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

const StyledBorrowlSubtitle = styled.p`
    margin: 0;
    margin-top: 2px;
    font-size: ${(props) => props.theme.sizes.caption}px;
    color: ${(props) => props.theme.colors.gray};
    font-weight: 400;
`

export default RenderBorrow
