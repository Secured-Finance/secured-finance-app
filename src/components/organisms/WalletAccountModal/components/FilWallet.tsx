import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Label, ModalProps, Spacer } from 'src/components/atoms';
import {
    getBlockExporerUrl,
    getFilecoinNetwork,
    useResetFilWalletProvider,
} from 'src/services/filecoin';
import { RootState } from 'src/store/types';
import { FIL_ADDRESS } from 'src/store/wallets/constants';
import {
    getFilAddress,
    isAnyWalletConnected,
} from 'src/store/wallets/selectors';
import theme from 'src/theme';
import styled from 'styled-components';

const FilWallet: React.FC<ModalProps> = ({ onDismiss }) => {
    const history = useHistory();
    const addressFromLocalStorage = localStorage.getItem(FIL_ADDRESS);
    const addressFromStore = useSelector(getFilAddress);

    const address = addressFromLocalStorage || addressFromStore;
    const blockExporerUrl = getBlockExporerUrl(getFilecoinNetwork(), address);

    const otherWalletConnected = useSelector((state: RootState) =>
        isAnyWalletConnected(state, 'filecoin')
    );

    const { onReset } = useResetFilWalletProvider();

    const handleSignOutClick = useCallback(() => {
        onDismiss?.();
        onReset();
        if (!otherWalletConnected) {
            history.push('/');
        }
    }, [history, onDismiss, onReset, otherWalletConnected]);

    return (
        <div>
            <div style={{ display: 'flex' }}>
                <StyledAccountContainer>
                    <StyledAccount>
                        <StyledAccountText data-cy='modal-wallet-address'>
                            {address}
                        </StyledAccountText>
                        <Label
                            style={{ marginTop: 5 }}
                            text='Filecoin address'
                        />
                    </StyledAccount>
                </StyledAccountContainer>
            </div>
            <StyledButtonContainer>
                <Button
                    href={blockExporerUrl}
                    text='View on Filscan'
                    style={{
                        background: theme.colors.buttonBlue,
                        fontSize: theme.sizes.callout,
                        fontWeight: 500,
                        color: theme.colors.white,
                    }}
                />
                <Spacer />
                <Button
                    onClick={handleSignOutClick}
                    text='Sign out'
                    style={{
                        background: theme.colors.buttonBlue,
                        fontSize: theme.sizes.callout,
                        fontWeight: 500,
                        color: theme.colors.white,
                    }}
                />
            </StyledButtonContainer>
        </div>
    );
};

const StyledAccount = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
`;

const StyledAccountContainer = styled.div`
    align-items: center;
    display: flex;
    flex: 1;
    flex-direction: column;
    margin-bottom: ${props => props.theme.spacing[4]}px;
`;

const StyledAccountText = styled.p`
    margin: 0;
    color: ${props => props.theme.colors.lightText};
    font-size: ${props => props.theme.sizes.callout};
`;

const StyledButtonContainer = styled.div`
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export default FilWallet;
