import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import theme from '../../theme'
import { Rate } from './types'

interface RateListProps {
    // rates: Array<Rate>,
}
  
const RateList: React.FC<RateListProps> = () => {
    const testRates = [
        { token: "ETH", lend: 7.0, borrow: 9.0 },
        { token: "FIL", lend: 8.0, borrow: 10.0 },
        { token: "USDC", lend: 2.24, borrow: 4.32 },
    ];

    return (
        <StyledRateList>
            <StyledCurrencySelector>
                <StyledMainCurrency>FIL</StyledMainCurrency> 
                <div style={{padding: '0 3px'}}>/</div>
                <StyledMainCurrency style={{background: "#172734"}}>ETH</StyledMainCurrency>
            </StyledCurrencySelector>
            <StyledRateTable>
                <StyledRateTableHeaderItem position={"left"}>TOKEN</StyledRateTableHeaderItem>
                <StyledRateTableHeaderItem position={"center"}>LEND</StyledRateTableHeaderItem>
                <StyledRateTableHeaderItem position={"center"}>BORROW</StyledRateTableHeaderItem>
                {testRates.map((rate, i) => {
                return (
                    <React.Fragment key={i}>
                        <StyledRateTableItem position={"left"} color={theme.colors.white}>{rate.token}</StyledRateTableItem>
                        <StyledRateTableItem position={"center"} color={theme.colors.ratesBlue}>{rate.lend.toFixed(2)}%</StyledRateTableItem>
                        <StyledRateTableItem position={"center"} color={theme.colors.ratesRed}>{rate.borrow.toFixed(2)}%</StyledRateTableItem>
                    </React.Fragment>
                );
                })}
            </StyledRateTable>
        </StyledRateList>
    )
}
  
const StyledRateList = styled.div`
    // margin-top: ${(props) => props.theme.spacing[1]}px;
    display: flex;
    flex-direction: column;
    text-align: center;
`

const StyledRateTable = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    font-size: ${(props) => props.theme.sizes.font}px;
`

const StyledCurrencySelector = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: ${(props) => props.theme.sizes.caption3}px;
    text-align: left;
    color: ${(props) => props.theme.colors.white};
`

const StyledMainCurrency = styled.div`
    background-color: ${(props) => props.theme.colors.ratesBlue};
    padding: 2px 6px;
    border-radius: 3px;
    color: ${(props) => props.theme.colors.white};
`

interface StyledRateTableHeaderItemProps {
    position?: string,
}

const StyledRateTableHeaderItem = styled.div<StyledRateTableHeaderItemProps>`
    color: ${(props) => props.theme.colors.darkBlue};
    padding: 4px 0;
    text-align: ${(props) => props.position};
`

interface StyledRateTableItemProps {
    color: string,
    position: string,
}

const StyledRateTableItem = styled.div<StyledRateTableItemProps>`
    font-size: ${(props) => props.theme.sizes.footnote}px;
    padding: 4px 0;
    color: ${(props) => props.color};
    text-align: ${(props) => props.position};
    font-weight: 500;
`

export default RateList