import BigNumber from 'bignumber.js';
import React from 'react';
import { getDisplayBalance, getUSDFormatBalanceNumber } from 'src/utils';
import { CurrencyInfo } from 'src/utils/currencyList';
import styled from 'styled-components';

interface CollateralContainerProps {
    collateral: BigNumber;
    value: number;
    shortName: string;
}

interface CollateralProps {
    currencies?: Array<CurrencyInfo>;
}

type ItemProps = CollateralContainerProps & CollateralProps;

const CollateralInfo: React.FC<ItemProps> = ({
    shortName,
    collateral,
    value,
}) => {
    return (
        <div>
            <StyledCollateral>
                <StyledWalletInfoContainer>
                    <StyledCollateralText>
                        {collateral != null ? getDisplayBalance(collateral) : 0}{' '}
                        {shortName}
                    </StyledCollateralText>
                    <StyledCollateralSubtitle>
                        {value != null ? getUSDFormatBalanceNumber(value) : 0}
                    </StyledCollateralSubtitle>
                </StyledWalletInfoContainer>
            </StyledCollateral>
        </div>
    );
};

const RenderCollateral: React.FC<CollateralContainerProps> = ({
    collateral,
    value,
    shortName,
}) => {
    return (
        <CollateralInfo
            collateral={collateral}
            value={value}
            shortName={shortName}
        />
    );
};

const StyledCollateral = styled.div`
    font-size: ${props => props.theme.sizes.subhead}px;
    align-items: center;
    display: flex;
    justify-content: center;
    margin: 0 auto;
`;

const StyledCollateralText = styled.div`
    font-size: ${props => props.theme.sizes.body}px;
    color: ${props => props.theme.colors.white};
    font-weight: 500;
`;

const StyledWalletInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const StyledCollateralSubtitle = styled.p`
    margin: 0;
    margin-top: 2px;
    font-size: ${props => props.theme.sizes.caption}px;
    color: ${props => props.theme.colors.gray};
    font-weight: 400;
`;

export default RenderCollateral;
