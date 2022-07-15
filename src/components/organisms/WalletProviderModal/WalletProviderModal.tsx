import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Button,
    Modal,
    ModalActions,
    ModalContent,
    ModalProps,
    ModalTitle,
} from 'src/components/atoms';
import { RootState } from 'src/store/types';
import theme from 'src/theme';
import { useWallet } from 'use-wallet';
import EthWalletConnector from './components/EthWalletConnector';
import FilWalletConnector from './components/FilWalletConnector';

const WalletProviderModal: React.FC<ModalProps> = ({ onDismiss, ccyIndex }) => {
    const { account } = useWallet();
    const walletProvider = useSelector(
        (state: RootState) => state.filWalletProvider.walletProvider
    );

    useEffect(() => {
        if (account && walletProvider) {
            onDismiss?.();
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
                    data-cy='cancel-button'
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
                >
                    Cancel
                </Button>
            </ModalActions>
        </Modal>
    );
};

export default WalletProviderModal;
