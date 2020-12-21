import React, { useCallback, useContext, useMemo, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import theme from '../../../theme';
import Button from '../../Button';

const Lend: React.FC = () => {
    const [interestRate, setInterestRate] = useState('')
    const [lendAmount, setLendAmount] = useState('')

    // const fullBalance = useMemo(() => {
    //     return getFullDisplayBalance(max)
    // }, [max])

    // const handleSelectMax = useCallback(() => {
    //     setCollateralAmount(fullBalance)
    // }, [fullBalance, setCollateralAmount])
    
    const handleInterest = useCallback((e: React.FormEvent<HTMLInputElement>) => {
        setInterestRate(e.currentTarget.value)
    },[setInterestRate])

    const handleLend = useCallback((e: React.FormEvent<HTMLInputElement>) => {
        setLendAmount(e.currentTarget.value)
    },[setLendAmount])

    return (
        <StyledLoanContainer>
            <StyledLoanSubcontainer>
                <StyledLabelContainer>
                    <StyledLoanLabel>Lend FIL</StyledLoanLabel>
                    <StyledLoanLabel fontWeight={400} textTransform={"capitalize"}>Balance: 0.00</StyledLoanLabel>
                </StyledLabelContainer>
                <StyledLoanInput 
                    type={'number'}
                    placeholder={'0'}
                    value={lendAmount}
                    onChange={handleLend}
                />
            </StyledLoanSubcontainer>
            <StyledLoanSubcontainer>
                <StyledLabelContainer>
                    <StyledLoanLabel>Interest rate</StyledLoanLabel>
                </StyledLabelContainer>
                <StyledLoanInput 
                    type={'number'}
                    placeholder={'0'}
                    value={interestRate}
                    onChange={handleInterest}
                />
            </StyledLoanSubcontainer>
            <StyledLabelContainer>
                <StyledLoanLabel fontSize={12}>Estimated returns</StyledLoanLabel>
                <StyledLoanLabel fontSize={12} fontWeight={400} textTransform={"capitalize"}>0$</StyledLoanLabel>
            </StyledLabelContainer>
            <StyledLabelContainer>
                <StyledLoanLabel fontSize={12}>Transaction fee</StyledLoanLabel>
                <StyledLoanLabel fontSize={12} fontWeight={400} textTransform={"capitalize"}>1.2$</StyledLoanLabel>
            </StyledLabelContainer>
            <StyledButtonContainer>
                <Button size={"lg"} style={{ background: 'rgba(0, 122, 255, 1)', color: theme.colors.white }}>Lend</Button>
            </StyledButtonContainer>
        </StyledLoanContainer>
    );
}

const StyledLoanContainer = styled.div`
    margin-top: ${(props) => props.theme.spacing[3]+4}px;
    display: flex;
    flex-direction: column;
`

const StyledLabelContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

const StyledLoanSubcontainer = styled.div`
    margin-bottom: ${(props) => props.theme.spacing[3]}px;
`

interface StyledLoanLabelProps {
    textTransform?: string,
    fontWeight?: number,
    fontSize?: number,
}

const StyledLoanLabel = styled.div<StyledLoanLabelProps>`
    text-transform: ${(props) => props.textTransform ? props.textTransform : 'uppercase' };
    font-size: ${(props) => props.fontSize ? props.fontSize : props.theme.sizes.subhead}px;
    margin-bottom: ${(props) => props.theme.sizes.caption3}px;
    margin-top: 0px;
    font-weight: ${(props) => props.fontWeight ? props.fontWeight :600};
    color: ${props => props.theme.colors.gray};
`

const StyledLoanInput = styled.input`
    background-color: transparent;
    border: 1px solid rgb(59, 55, 91);
    height: 42px;
    padding: 0px 10px;
    font-size: 14px;
    outline: none;
    color: ${props => props.theme.colors.white};
    width: calc(100% - 22px);
    -webkit-appearance: none;
    -moz-appearance: textfield;
`

const StyledButtonContainer = styled.div`
    margin-top: 10px;
`

export default Lend