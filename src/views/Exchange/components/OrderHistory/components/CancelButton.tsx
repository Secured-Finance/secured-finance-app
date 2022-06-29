import React, { useCallback } from 'react';
import { useCancelOrder } from 'src/hooks/useCancelOrder';
import styled from 'styled-components';

interface CancelButtonProps {
    orderId?: number;
    selectedCcy?: string;
    selectedTerms?: string;
}

type CombinedProps = CancelButtonProps;

export const RenderCancelButton: React.FC<CombinedProps> = ({
    orderId,
    selectedCcy,
    selectedTerms,
}) => {
    const { onCancelOrder } = useCancelOrder(
        selectedCcy,
        selectedTerms,
        orderId
    );

    const handleCancelOrder = useCallback(async () => {
        try {
            await onCancelOrder();
        } catch (e) {
            console.error(e);
        }
    }, [onCancelOrder]);

    return (
        <StyledActionsContainer>
            <StyledActionButton onClick={handleCancelOrder}>
                Cancel
            </StyledActionButton>
        </StyledActionsContainer>
    );
};

const StyledActionsContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    // justify-content: space-evenly;
`;

const StyledActionButton = styled.button`
    padding: 2px 5px;
    background-color: ${props => props.theme.colors.darkenedBg};
    color: ${props => props.theme.colors.blue};
    font-size: 9px;
    font-weight: 700;
    outline: none;
    border: none;
    border-radius: 15px;
`;
