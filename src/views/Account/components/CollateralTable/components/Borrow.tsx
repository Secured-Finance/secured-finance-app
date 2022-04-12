import BigNumber from 'bignumber.js';
import React from 'react';
import { getDisplayBalance, getUSDFormatBalanceNumber } from 'src/utils';
import styled from 'styled-components';

interface BorrowContainerProps {
    locked: BigNumber;
    value: number;
    shortName: number;
}

const RenderBorrow: React.FC<BorrowContainerProps> = ({
    locked,
    value,
    shortName,
}) => {
    return (
        <StyledBorrow>
            <StyledWalletInfoContainer>
                <StyledBorrowText>
                    {locked != null ? getDisplayBalance(locked) : 0} {shortName}
                </StyledBorrowText>
                <StyledBorrowSubtitleContainer>
                    <StyledBorrowlSubtitle>
                        {value != null ? getUSDFormatBalanceNumber(value) : 0}
                    </StyledBorrowlSubtitle>
                </StyledBorrowSubtitleContainer>
            </StyledWalletInfoContainer>
        </StyledBorrow>
    );
};

const StyledBorrow = styled.div`
    font-size: ${props => props.theme.sizes.subhead}px;
    align-items: center;
    display: flex;
    justify-content: center;
    margin: 0 auto;
`;

const StyledBorrowText = styled.div`
    font-size: ${props => props.theme.sizes.body}px;
    color: ${props => props.theme.colors.white};
    font-weight: 500;
`;

const StyledWalletInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const StyledBorrowSubtitleContainer = styled.div``;

const StyledBorrowlSubtitle = styled.p`
    margin: 0;
    margin-top: 2px;
    font-size: ${props => props.theme.sizes.caption}px;
    color: ${props => props.theme.colors.gray};
    font-weight: 400;
`;

export default RenderBorrow;
