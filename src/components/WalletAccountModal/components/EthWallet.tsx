import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import theme from 'src/theme';
import Button from 'src/components/Button';
import Label from 'src/components/Label';
import { ModalProps } from 'src/components/Modal';
import Spacer from 'src/components/Spacer';
import { CACHED_PROVIDER_KEY } from 'src/contexts/FilecoinWalletProvider';
import { useSelector } from 'react-redux';
import { isAnyWalletConnected } from 'src/store/wallets/selectors';
import { RootState } from 'src/store/types';

const EthWallet: React.FC<ModalProps> = ({ onDismiss, ...props }) => {
    const { account, reset } = useWallet();
    const history = useHistory();
    const otherWalletConnected = useSelector((state: RootState) =>
        isAnyWalletConnected(state, 'ethereum')
    );

    const handleSignOutClick = useCallback(() => {
        reset();
        localStorage.removeItem(CACHED_PROVIDER_KEY);
        onDismiss();
        if (!otherWalletConnected) {
            history.push('/');
        }
    }, [onDismiss, reset]);

    return (
        <div>
            <div style={{ display: 'flex' }}>
                <StyledAccountContainer>
                    <StyledAccount>
                        <StyledAccountText>{account}</StyledAccountText>
                        <Label
                            style={{ marginTop: 5 }}
                            text='Ethereum address'
                        />
                    </StyledAccount>
                </StyledAccountContainer>
            </div>
            <StyledButtonContainer>
                <Button
                    href={`https://etherscan.io/address/${account}`}
                    text='View on Etherscan'
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

export default EthWallet;
