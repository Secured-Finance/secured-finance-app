import React from 'react';
import theme from '../../theme';
import Button from '../Button';
import Modal, { ModalProps } from '../Modal';
import ModalActions from '../ModalActions';
import ModalContent from '../ModalContent';
import ModalTitle from '../ModalTitle';
import EthWallet from './components/EthWallet';
import FilWallet from './components/FilWallet';

const WalletModal: React.FC<ModalProps> = ({ onDismiss, ccyIndex }) => {
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
                    text='Close'
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

export default WalletModal;
