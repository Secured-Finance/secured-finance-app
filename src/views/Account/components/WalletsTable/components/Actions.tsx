import React, { useCallback } from 'react';
import styled from 'styled-components';
import {
    CollateralModal,
    WalletProviderModal,
    SendModal,
    WalletAccountModal,
} from 'src/components/organisms';
import useModal from 'src/hooks/useModal';

interface ActionProps {
    callbackMap?: {
        send?: () => void;
        signOut?: () => void;
        placeCollateral?: () => void;
    };
    ccyIndex: number;
}

const RenderActions: React.FC<ActionProps> = ({ callbackMap, ccyIndex }) => {
    const [onPresentSettingsModal] = useModal(
        <WalletAccountModal ccyIndex={ccyIndex} />
    );
    const [onPresentSendModal] = useModal(<SendModal ccyIndex={ccyIndex} />);
    const [onPresentCollateralModal] = useModal(
        <CollateralModal ccyIndex={ccyIndex} />
    );

    const [onPresentWalletEthProviderModal] = useModal(
        <WalletProviderModal ccyIndex={ccyIndex} />,
        'provider'
    );

    const handleConnectWallet = useCallback(() => {
        onPresentWalletEthProviderModal();
    }, [onPresentWalletEthProviderModal]);

    return (
        <div>
            {callbackMap != null &&
            callbackMap.send != null &&
            callbackMap.placeCollateral != null &&
            callbackMap.signOut != null ? (
                <StyledActionsContainer>
                    <StyledActionButton onClick={onPresentSendModal}>
                        Send
                    </StyledActionButton>
                    {ccyIndex === 0 ? (
                        <StyledActionButton onClick={onPresentCollateralModal}>
                            Manage Collateral
                        </StyledActionButton>
                    ) : null}
                    <StyledActionButton onClick={onPresentSettingsModal}>
                        Settings
                    </StyledActionButton>
                </StyledActionsContainer>
            ) : (
                <StyledActionsContainer>
                    <StyledActionButton onClick={handleConnectWallet}>
                        Connect Wallet
                    </StyledActionButton>
                </StyledActionsContainer>
            )}
        </div>
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
    cursor: pointer;
`;

export default RenderActions;
