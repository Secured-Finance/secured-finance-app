import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import WalletAccountModal from '../../../../../components/WalletAccountModal'
import WalletProviderModal from '../../../../../components/WalletProviderModal'
import useModal from '../../../../../hooks/useModal'

interface ActionProps {
    callbackMap?: {
        send?: () => void
        signOut?: () => void
        placeCollateral?: () => void    
    }
}

const RenderActions: React.FC<ActionProps> = ({callbackMap}) => {
    const [onPresentAccountModal] = useModal(<WalletAccountModal />)

    const [onPresentWalletProviderModal] = useModal(
        <WalletProviderModal />,
        'provider',
    )
        
    const handleConnectWallet = useCallback(() => {
    onPresentWalletProviderModal()
    }, [onPresentWalletProviderModal])

    return (
        <div>
            {
                callbackMap != null 
                && callbackMap.send != null
                && callbackMap.placeCollateral != null
                && callbackMap.signOut != null
                ?
                <StyledActionsContainer>
                    <StyledActionButton 
                        onClick={onPresentAccountModal}
                        >Send
                    </StyledActionButton>
                    <StyledActionButton
                        onClick={onPresentAccountModal}
                        >Place Collateral
                    </StyledActionButton>
                    <StyledActionButton 
                        onClick={callbackMap.signOut}
                        >Sign Out
                    </StyledActionButton>
                </StyledActionsContainer>
                :
                <StyledActionsContainer>
                    <StyledActionButton 
                        onClick={handleConnectWallet}
                        >Connect Wallet
                    </StyledActionButton>
                </StyledActionsContainer>
            }
        </div>
    )
}

const StyledActionsContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
`

const StyledActionButton = styled.button`
    padding: 4px 10px;
    background-color: #FAFAFA;
    color: #0E7EEB;
    font-size: 13px;
    font-weight: 700;
    outline: none; 
    border: none;
    border-radius: 15px;
`

export default RenderActions