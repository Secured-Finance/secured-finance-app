import { useCallback, useState } from 'react';
import KeyIcon from 'src/assets/img/key.svg';
import LedgerIcon from 'src/assets/img/ledger.svg';
import SeedIcon from 'src/assets/img/seed.svg';
import { Dialog, WalletRadioGroup } from 'src/components/molecules';
import useModal from 'src/hooks/useModal';
import LedgerModal from '../WalletProviderModal/components/LedgerModal';
import MnemonicModal from '../WalletProviderModal/components/MnemonicModal';
import PrivateKeyModal from '../WalletProviderModal/components/PrivateKeyModal';
export const FilWalletDialog = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    const closeLedgerModal = () => {
        dismissLedgerModal();
    };
    const [onMnemonicModal] = useModal(<MnemonicModal />);
    const [onPrivateKeyModal] = useModal(<PrivateKeyModal />);
    const [onLedgerModal, dismissLedgerModal] = useModal(
        <LedgerModal onClose={closeLedgerModal} />,
        'ledger'
    );

    const [wallet, setWallet] = useState('');

    const handleClick = useCallback(() => {
        switch (wallet) {
            case 'Mnemonic':
                onMnemonicModal();
                break;
            case 'PrivateKey':
                onPrivateKeyModal();
                break;
            case 'Ledger':
                onLedgerModal();
                break;
        }
        onClose();
    }, [wallet, onClose, onMnemonicModal, onPrivateKeyModal, onLedgerModal]);

    const options = [
        { name: 'Ledger', Icon: LedgerIcon },
        { name: 'Mnemonic', Icon: SeedIcon },
        { name: 'PrivateKey', Icon: KeyIcon },
    ];
    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title='Add Filecoin Wallet'
            description='In order to borrow and lend filecoin, you must connect a filecoin wallet.'
            callToAction='Continue'
            onClick={handleClick}
        >
            <>
                <WalletRadioGroup
                    value={wallet}
                    onChange={setWallet}
                    options={options}
                />
            </>
        </Dialog>
    );
};
