import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useWallet } from 'use-wallet';
import { RootState } from '../../store/types';
import theme from '../../theme';
import Button from '../Button';
import Modal, { ModalProps } from '../Modal';
import ModalActions from '../ModalActions';
import ModalContent from '../ModalContent';
import ModalTitle from '../ModalTitle';
import EthWalletConnector from './components/EthWalletConnector';
import FilWalletConnector from './components/FilWalletConnector';

const WalletProviderModal: React.FC<ModalProps> = ({ onDismiss, ccyIndex }) => {
    const { account } = useWallet();
    const walletProvider = useSelector(
        (state: RootState) => state.filWalletProvider.walletProvider
    );

    useEffect(() => {
        if (account && walletProvider) {
            onDismiss();
        }
    }, [account, walletProvider, onDismiss]);

    return (
        <Modal>
            <ModalTitle text='Select a wallet provider' />
            <ModalContent>
                {ccyIndex === 0 ? (
                    <EthWalletConnector onDismiss={onDismiss} />
                ) : (
                    <FilWalletConnector onDismiss={onDismiss} />
                )}
            </ModalContent>
            <ModalActions>
                <Button
                    text='Cancel'
                    onClick={onDismiss}
                    style={{
                        background: 'transparent',
                        borderWidth: 1,
                        borderColor: theme.colors.buttonBlue,
                        borderBottom: theme.colors.buttonBlue,
                        fontSize: theme.sizes.callout,
                        fontWeight: 500,
                        color: theme.colors.white,
                    }}
                />
            </ModalActions>
        </Modal>
    );
};

export default WalletProviderModal;
