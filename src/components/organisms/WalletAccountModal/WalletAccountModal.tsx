import React from 'react';
import { Button } from 'src/components/atoms';
import {
    Modal,
    ModalActions,
    ModalContent,
    ModalProps,
    ModalTitle,
} from 'src/components/legacy';
import theme from 'src/theme';
import EthWallet from './components/EthWallet';
import FilWallet from './components/FilWallet';

const WalletAccountModal: React.FC<ModalProps> = ({ onDismiss, ccyIndex }) => {
    return (
        <Modal>
            <ModalTitle text='Wallet Information' />
            <ModalContent>
                {ccyIndex === 1 ? (
                    <FilWallet onDismiss={onDismiss} />
                ) : (
                    <EthWallet onDismiss={onDismiss} />
                )}
            </ModalContent>
            <ModalActions>
                <Button
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
                    Close
                </Button>
            </ModalActions>
        </Modal>
    );
};

export default WalletAccountModal;
