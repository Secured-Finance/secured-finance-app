import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Label, ModalProps, Spacer } from 'src/components/atoms';
import { CACHED_PROVIDER_KEY } from 'src/contexts/SecuredFinanceProvider/SecuredFinanceProvider';
import { RootState } from 'src/store/types';
import { resetEthWallet } from 'src/store/wallets';
import { isAnyWalletConnected } from 'src/store/wallets/selectors';
import theme from 'src/theme';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';

const EthWallet: React.FC<ModalProps> = ({ onDismiss }) => {
    const { account, reset } = useWallet();
    const dispatch = useDispatch();
    const history = useHistory();
    const otherWalletConnected = useSelector((state: RootState) =>
        isAnyWalletConnected(state, 'ethereum')
    );

    const handleSignOutClick = useCallback(() => {
        reset();
        dispatch(resetEthWallet());
        localStorage.removeItem(CACHED_PROVIDER_KEY);
        if (!otherWalletConnected) {
            history.push('/');
        }
        onDismiss?.();
    }, [dispatch, history, onDismiss, otherWalletConnected, reset]);

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
                    style={{
                        background: theme.colors.buttonBlue,
                        fontSize: theme.sizes.callout,
                        fontWeight: 500,
                        color: theme.colors.white,
                    }}
                >
                    View on Etherscan
                </Button>
                <Spacer />
                <Button
                    data-cy='modal-sign-out-button'
                    onClick={handleSignOutClick}
                    style={{
                        background: theme.colors.buttonBlue,
                        fontSize: theme.sizes.callout,
                        fontWeight: 500,
                        color: theme.colors.white,
                    }}
                >
                    Sign out
                </Button>
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
