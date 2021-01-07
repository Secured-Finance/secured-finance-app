import React, { useMemo } from 'react'
import styled from 'styled-components'
import theme from '../../theme'
import ArrowSVG from '../ArrowSVG'
import { currencyList, CurrencyInfo, collateralList } from '../../utils/currencies'

interface CurrencySelectorProps {
    selectedCcy: string
    onClick?: () => void
    disabled?: boolean
    type?: "collateral" | "currencies"
}

interface CurrenciesListProps {
    currencies: Array<CurrencyInfo>
}

type ChildrenProps = CurrencySelectorProps & CurrenciesListProps

const RenderImage: React.FC<ChildrenProps> = ({ selectedCcy, currencies, }) => {
    let icon: string

    currencies.filter((currency, i) => {
        if (selectedCcy == currency.shortName) {
            icon = currency.icon
        }
    })

    return (
            <img width={28} src={icon}/>
    )
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ selectedCcy, onClick, type, disabled }) => {
    let currencies: CurrencyInfo[] = []
    switch(type) {
        case "collateral":
            currencies = collateralList
            break
        case "currencies":
            currencies = currencyList
            break
        default:
            currencies = currencyList
            break
    }

    return (
        <StyledCurrencySelector
            onClick={onClick}
            disabled={disabled}
        >
            <RenderImage selectedCcy={selectedCcy} currencies={currencies}/>
            <StyledCurrencyText>{selectedCcy}</StyledCurrencyText>
            <StyledSVGContainer>
                {
                    disabled
                    ?
                    null
                    :
                    <ArrowSVG width={'15'} height="6" rotate={0} fill={theme.colors.white} stroke={theme.colors.white}/>
                }
            </StyledSVGContainer>
        </StyledCurrencySelector>
    )
}

const StyledCurrencySelector = styled.button`
    min-width: 25%;
    background: transparent;
    outline: none;
    color: white;
    font-size: 16px;
    font-weight: 500;
    border: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0;
`

interface StyledCurrencyTextProps {
    marginLeft?: string;
}

const StyledCurrencyText = styled.p<StyledCurrencyTextProps>`
    margin: 0;
    margin-left: ${(props) => props.marginLeft ? props.marginLeft : '7px'};
    text-align: left;
`

const StyledSVGContainer = styled.span` display: inline-block; margin-left: 2px;`

export default CurrencySelector
