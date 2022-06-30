import BigNumber from 'bignumber.js';
import React, { useCallback, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Button } from 'src/components/atoms';
import styled from 'styled-components';
import { usePlaceOrder } from '../../../../../hooks/usePlaceOrder/usePlaceOrder';
import {
    LendingTerminalStore,
    updateLendAmount,
    updateLendingTerms,
    updateLendRate,
} from '../../../../../store/lendingTerminal';
import { RootState } from '../../../../../store/types';
import { PlaceOrderForm } from './PlaceOrderForm';

const Lend: React.FC<LendingTerminalStore> = ({
    selectedCcy,
    lendAmount,
    lendRate,
    selectedTerms,
}) => {
    const dispatch = useDispatch();
    const [termsOpen, setTermsOpen] = useState(false);
    const [pendingTx, setPendingTx] = useState(false);

    const handleOpenTerms = useCallback(
        (e: React.FormEvent<HTMLSelectElement>, termsOpen: boolean) => {
            dispatch(updateLendingTerms(e.currentTarget.value));
            setTermsOpen(!termsOpen);
        },
        [dispatch]
    );

    const handleInterestRate = useCallback(
        (e: React.FormEvent<HTMLInputElement>) => {
            dispatch(updateLendRate(e.currentTarget.valueAsNumber));
        },
        [dispatch]
    );

    const handleLendAmount = useCallback(
        (e: React.FormEvent<HTMLInputElement>) => {
            dispatch(updateLendAmount(e.currentTarget.valueAsNumber));
        },
        [dispatch]
    );

    const { placeOrder } = usePlaceOrder();
    const handleLoanDeal = useCallback(async () => {
        try {
            setPendingTx(true);
            await placeOrder(
                selectedCcy,
                selectedTerms,
                0,
                lendAmount,
                new BigNumber(lendRate).multipliedBy(100).toNumber()
            );
            setPendingTx(false);
        } catch (e) {
            console.error(e);
        }
    }, [lendAmount, lendRate, placeOrder, selectedCcy, selectedTerms]);

    return (
        <StyledLoanContainer>
            <PlaceOrderForm
                amountFILValue={lendAmount.toString()}
                onChangeAmountFILValue={handleLendAmount}
                termValue={selectedTerms}
                onChangeTerm={(e: React.FormEvent<HTMLSelectElement>) =>
                    handleOpenTerms(e, termsOpen)
                }
                insertRateValue={lendRate.toString()}
                onChangeInsertRate={handleInterestRate}
            />
            <StyledButtonContainer>
                <Button onClick={handleLoanDeal} disabled={pendingTx}>
                    Lend
                </Button>
            </StyledButtonContainer>
        </StyledLoanContainer>
    );
};

const StyledLoanContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const StyledButtonContainer = styled.div`
    display: grid;
    margin-top: 13px;
`;

const mapStateToProps = (state: RootState) => state.lendingTerminal;
export default connect(mapStateToProps)(Lend);
