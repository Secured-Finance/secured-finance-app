import React from 'react';
import Chip from 'src/components/atoms/Chip/Chip';
import { CollateralModal } from 'src/components/organisms';
import useModal from 'src/hooks/useModal';
import styled from 'styled-components';

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
            <Chip onClick={onPresentCollateralModal} text='Deposit' />
            <Chip onClick={onPresentCollateralModal} text='Withdraw' />
        </StyledActionsContainer>
    );
};

const StyledActionsContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
`;

export default RenderActions;
