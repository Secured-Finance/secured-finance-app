import React, { useCallback } from 'react'
import { connect } from 'react-redux';
import { useCancelOrder } from 'src/hooks/useCancelOrder';
import { LendingStore } from 'src/store/lending';
import { RootState } from 'src/store/types';
import styled from 'styled-components'

interface CancelButtonProps {
    orderId?: string;
}

type CombinedProps = CancelButtonProps & LendingStore;

const RenderCancelButton: React.FC<CombinedProps> = ({ orderId, currencyIndex, termsIndex }) => {

    const { onCancelOrder } = useCancelOrder(
        currencyIndex,
        termsIndex,
        orderId,
    );

    const handleCancelOrder = useCallback(async () => {
        try {
            await onCancelOrder();
        } catch (e) {
            console.log(e);
        }
    }, [onCancelOrder]);

    return (
        <StyledActionsContainer>
            <StyledActionButton 
                onClick={handleCancelOrder}
                >Cancel
            </StyledActionButton>
        </StyledActionsContainer>
    )
}

const StyledActionsContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    // justify-content: space-evenly;
`

const StyledActionButton = styled.button`
    padding: 2px 5px;
    background-color: ${(props) => props.theme.colors.darkenedBg};
    color: ${(props) => props.theme.colors.blue};
    font-size: 9px;
    font-weight: 700;
    outline: none; 
    border: none;
    border-radius: 15px;
`

const mapStateToProps = (state: RootState) => state.lendingTerminal;
export default connect(mapStateToProps)(RenderCancelButton);