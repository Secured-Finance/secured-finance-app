import React from 'react';
import styled from 'styled-components';
import seedLogo from 'src/assets/img/seed.svg';
import keyLogo from 'src/assets/img/key.svg';
import ledgerLogo from 'src/assets/img/ledger.svg';

import { ModalProps, Spacer } from 'src/components/atoms';
import useModal from 'src/hooks/useModal';

import WalletCard from './WalletCard';
import MnemonicModal from './MnemonicModal';
import PrivateKeyModal from './PrivateKeyModal';
import LedgerModal from './LedgerModal';

const FilWalletConnector: React.FC<ModalProps> = () => {
    const closeLedgerModal = () => {
        dismissLedgerModal();
    };
    const [onMnemonicModal] = useModal(<MnemonicModal />);
    const [onPrivateKeyModal] = useModal(<PrivateKeyModal />);
    const [onLedgerModal, dismissLedgerModal] = useModal(
        <LedgerModal onClose={closeLedgerModal} />,
        'ledger'
    );

    return (
        <StyledWalletsWrapper>
            <StyledWalletCard>
                <WalletCard
                    icon={<img src={seedLogo} style={{ height: 24 }} />}
                    onConnect={onMnemonicModal}
                    title='Mnemonic phrase'
                    buttonText='Generate'
                />
            </StyledWalletCard>
            <Spacer size='sm' />
            <StyledWalletCard>
                <WalletCard
                    icon={<img src={keyLogo} style={{ height: 24 }} />}
                    onConnect={onPrivateKeyModal}
                    title='Private Key'
                    buttonText='Import'
                />
            </StyledWalletCard>

            <Spacer size='sm' />

            <StyledWalletCard>
                <WalletCard
                    icon={<img src={ledgerLogo} style={{ height: 26 }} />}
                    onConnect={onLedgerModal}
                    title='Ledger wallet'
                />
            </StyledWalletCard>
        </StyledWalletsWrapper>
    );
};

const StyledWalletsWrapper = styled.div`
    display: flex;
    @media (max-width: ${props => props.theme.breakpoints.mobile}px) {
        flex-direction: column;
        flex-wrap: none;
    }
`;

const StyledWalletCard = styled.div`
    flex-basis: calc(50% - ${props => props.theme.spacing[2] / 2}px);
`;

export default FilWalletConnector;
