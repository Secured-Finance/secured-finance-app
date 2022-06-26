import React from 'react';
import KeyLogo from 'src/assets/img/key.svg';
import LedgerLogo from 'src/assets/img/ledger.svg';
import SeedLogo from 'src/assets/img/seed.svg';
import { ModalProps, Spacer } from 'src/components/atoms';
import useModal from 'src/hooks/useModal';
import styled from 'styled-components';
import LedgerModal from './LedgerModal';
import MnemonicModal from './MnemonicModal';
import PrivateKeyModal from './PrivateKeyModal';
import WalletCard from './WalletCard';

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
                    icon={<SeedLogo style={{ height: 24 }} />}
                    onConnect={onMnemonicModal}
                    title='Mnemonic phrase'
                    buttonText='Generate'
                />
            </StyledWalletCard>
            <Spacer size='sm' />
            <StyledWalletCard>
                <WalletCard
                    icon={<KeyLogo style={{ height: 24 }} />}
                    onConnect={onPrivateKeyModal}
                    title='Private Key'
                    buttonText='Import'
                />
            </StyledWalletCard>

            <Spacer size='sm' />

            <StyledWalletCard>
                <WalletCard
                    icon={<LedgerLogo style={{ height: 26 }} />}
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
