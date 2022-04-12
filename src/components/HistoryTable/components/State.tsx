import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import useModal from '../../../hooks/useModal';
import LoanConfirmationModal from '../../LoanConfirmationModal';

interface StateProps {
    loan: any;
}

const RenderAction: React.FC<StateProps> = ({ loan }) => {
    const [onPresentArrangeLoan] = useModal(
        <LoanConfirmationModal loan={loan} />
    );

    return (
        <div>
            {
                <StyledActionsContainer>
                    <StyledActionButton
                    // onClick={onPresentArrangeLoan}
                    >
                        <StyledLink to={`/loan/${loan.loanId}`}>
                            State
                        </StyledLink>
                        {/* State */}
                    </StyledActionButton>
                </StyledActionsContainer>
            }
        </div>
    );
};

const StyledActionsContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
`;

const StyledLink = styled(Link)`
    align-items: center;
    color: inherit;
    display: flex;
    flex: 1;
    text-decoration: none;
`;

const StyledActionButton = styled.button`
    padding: 4px 10px;
    background-color: ${props => props.theme.colors.darkenedBg};
    color: ${props => props.theme.colors.blue};
    font-size: 13px;
    font-weight: 700;
    outline: none;
    border: none;
    border-radius: 15px;
`;

export default RenderAction;
