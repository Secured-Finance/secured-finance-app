import React from 'react'
import styled from 'styled-components'
import { currencyList, CurrencyInfo } from '../../../../../utils/currencies'
import { ordinaryFormat, usdFormat } from '../../../../../utils/formatNumbers'

interface CollateralContainerProps {
    collateral: number,
    value: number,
    index: any,
}

interface CollateralProps {
    currencies?: Array<CurrencyInfo>,
}

type ItemProps = CollateralContainerProps & CollateralProps

const CollateralInfo: React.FC<ItemProps> = ({index, currencies, collateral, value}) => {
    let shortName: string

    currencies.filter((currency, i) => {
        if (index == i) {
            shortName = currency.shortName
        }
    })

    return (
        <div>
            <StyledCollateral>
                <StyledWalletInfoContainer>
                    <StyledCollateralText
                    >{ collateral != null ? ordinaryFormat(collateral) : 0 } {shortName}</StyledCollateralText>
                    <StyledCollateralSubtitle
                    >{ value != null ? usdFormat(value) : 0 }</StyledCollateralSubtitle>
                </StyledWalletInfoContainer>
            </StyledCollateral>
        </div>
    )
}

const RenderCollateral: React.FC<CollateralContainerProps> = ({collateral, value, index}) => {
    return (
        <CollateralInfo 
            collateral={collateral}
            value={value}
            index={index}
            currencies={currencyList}
        />
    )
}

const StyledCollateral = styled.div`
    font-size: ${(props) => props.theme.sizes.subhead}px;
    align-items: center;
    display: flex;
    justify-content: center;
    margin: 0 auto;
`

const StyledCollateralText = styled.div`
    font-size: ${(props) => props.theme.sizes.body}px;
    color: ${(props) => props.theme.colors.white};
    font-weight: 500;
`

const StyledWalletInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`

const StyledCollateralSubtitle = styled.p`
    margin: 0;
    margin-top: 2px;
    font-size: ${(props) => props.theme.sizes.caption}px;
    color: ${(props) => props.theme.colors.gray};
    font-weight: 400;
`

export default RenderCollateral
