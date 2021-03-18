import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Button } from "../../../../../components/common/Buttons"
import { PlaceOrderForm } from './PlaceOrderForm'

const Borrow: React.FC = () => {
    const [interestRate, setInterestRate] = useState('')
    const [borrowAmount, setBorrowAmount] = useState('')
    const [selectedTerms, setSelectedTerms] = useState('3mo')
    const [termsOpen, setTermsOpen] = useState(false)

    const handleOpenTerms = useCallback((termsOpen:boolean) => {
        setTermsOpen(!termsOpen)
    },[setTermsOpen])

    const handleInterest = useCallback((e: React.FormEvent<HTMLInputElement>) => {
        setInterestRate(e.currentTarget.value)
    },[setInterestRate])

    const handleBorrow = useCallback((e: React.FormEvent<HTMLInputElement>) => {
        setBorrowAmount(e.currentTarget.value)
    },[setBorrowAmount])

    return (
        <StyledLoanContainer>
            <PlaceOrderForm
                amountFILValue={borrowAmount}
                onChangeAmountFILValue={handleBorrow}
                termValue={selectedTerms}
                onChangeTerm={() => handleOpenTerms(termsOpen)}
                insertRateValue={interestRate}
                onChangeInsertRate={handleInterest}
            />

            <StyledButtonContainer>
                <Button accent={'success'}>Borrow</Button>
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

export default Borrow