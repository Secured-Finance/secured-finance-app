import Badge from 'src/assets/icons/badge.svg';
import { Dialog } from 'src/components/molecules';

export const ConnectWalletDialog = ({
    isOpen,
    onClose,
    handleConnectWallet,
}: {
    isOpen: boolean;
    onClose: () => void;
    handleConnectWallet: () => void;
}) => {
    return (
        <Dialog
            title='Connect Wallet'
            description='Get Points by placing limit orders and maintaining active positions on our app. But first, connect your wallet.'
            callToAction='Connect Wallet'
            onClick={handleConnectWallet}
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className='mx-auto flex h-[100px] w-[100px] items-center justify-center rounded-full border border-white/[19%] bg-white/[5%]'>
                <Badge className='h-16 w-16' />
            </div>
        </Dialog>
    );
};
