import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Network } from '@glif/filecoin-address';
import styled from 'styled-components';
import { useResetFilWalletProvider } from 'src/services/filecoin';
import theme from 'src/theme';
import Button from 'src/components/Button';
import Label from 'src/components/Label';
import { ModalProps } from 'src/components/Modal';
import Spacer from 'src/components/Spacer';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/types';

const FilWallet: React.FC<ModalProps> = ({ onDismiss }) => {
    const [address, setAddress] = useState<string>();
    const walletProvider = useSelector(
        (state: RootState) => state.filWalletProvider.walletProvider
    );
    const history = useHistory();

    const getAddress = useCallback(() => {
        const accounts = walletProvider.wallet
            .getAccounts(0, 1, Network.TEST)
            // @ts-ignore
            .then(res => {
                setAddress(res[0]);
            })
            // @ts-ignore
            .catch(err => console.log(err));
    }, [setAddress, walletProvider]);

    const { onReset } = useResetFilWalletProvider();

    const handleSignOutClick = useCallback(() => {
        onDismiss!();
        onReset();
        history.push('/');
    }, [onDismiss]);

    useEffect(() => {
        if (walletProvider) {
            getAddress();
        }
    }, [walletProvider, getAddress]);

    return (
        <div>
            <div style={{ display: 'flex' }}>
                <StyledAccountContainer>
                    <StyledAccount>
                        <StyledAccountText>{address}</StyledAccountText>
                        <Label
                            style={{ marginTop: 5 }}
                            text='Filecoin address'
                        />
                    </StyledAccount>
                </StyledAccountContainer>
            </div>
            <StyledButtonContainer>
                <Button
                    href={`https://filscan.io/#/tipset/address-detail?address=${address}`}
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
