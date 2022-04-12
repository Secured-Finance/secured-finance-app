import React, { useCallback } from 'react';
import styled from 'styled-components';
import CollateralModal from '../../../../../components/CollateralModal';
import useModal from '../../../../../hooks/useModal';

interface ActionProps {
    ccyIndex: number;
    collateralVault: string;
}

const RenderActions: React.FC<ActionProps> = ({ ccyIndex }) => {
    const [onPresentCollateralModal] = useModal(
        <CollateralModal ccyIndex={ccyIndex} />
    );

    return (
        <StyledActionsContainer>
            <StyledActionButton onClick={onPresentCollateralModal}>
                Deposit
            </StyledActionButton>
            <StyledActionButton onClick={onPresentCollateralModal}>
                Withdraw
            </StyledActionButton>
        </StyledActionsContainer>
    );
};

const StyledActionsContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
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

export default RenderActions;
