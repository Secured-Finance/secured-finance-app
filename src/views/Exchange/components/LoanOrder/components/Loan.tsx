import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Button } from "../../../../../components/common/Buttons"
import { PlaceOrderForm } from './PlaceOrderForm'

const Lend: React.FC = () => {
    const [interestRate, setInterestRate] = useState('')
    const [lendAmount, setLendAmount] = useState('')
    const [selectedTerms, setSelectedTerms] = useState('3mo')
    const [termsOpen, setTermsOpen] = useState(false)

    const handleOpenTerms = useCallback((termsOpen:boolean) => {
        setTermsOpen(!termsOpen)
    },[setTermsOpen])
    
    const handleInterest = useCallback((e: React.FormEvent<HTMLInputElement>) => {
        setInterestRate(e.currentTarget.value)
    },[setInterestRate])

    const handleLend = useCallback((e: React.FormEvent<HTMLInputElement>) => {
        setLendAmount(e.currentTarget.value)
    },[setLendAmount])

    return (
        <StyledLoanContainer>
            <PlaceOrderForm
                amountFILValue={lendAmount}
                onChangeAmountFILValue={handleLend}
                termValue={selectedTerms}
                onChangeTerm={() => handleOpenTerms(termsOpen)}
                insertRateValue={interestRate}
                onChangeInsertRate={handleInterest}
            />
            <StyledButtonContainer>
                <Button>Lend</Button>
            </StyledButtonContainer>
        </StyledLoanContainer>
    );
}

const StyledLoanContainer = styled.div`
    display: flex;
    flex-direction: column;
`

const StyledButtonContainer = styled.div`
    display: grid;
    margin-top: 13px;
`


export default Lend