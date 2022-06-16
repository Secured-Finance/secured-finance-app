import { SVGProps, useCallback, useState } from 'react';
import { ReactComponent as MetaMaskIcon } from 'src/assets/img/metamask-fox.svg';
import { ReactComponent as WalletConnectIcon } from 'src/assets/img/wallet-connect.svg';

import { Dialog } from '../Dialog/Dialog';

const WalletProvider = ({
    name,
    Icon,
    handleChange,
}: {
    name: string;
    key: 'metamask' | 'walletconnect';
    Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
    return (
        <div className='m-4 flex flex-row justify-between gap-6'>
            <span className='flex'>
                <Icon className='h-6 w-6' />
                <p className='ml-6 text-white'>{name}</p>
            </span>
            <input
                type='radio'
                className='flex h-4 w-4 border-gray-300 bg-secondary-500 text-primary-400 ring-offset-gray-800 focus:ring-2 focus:ring-blue-400'
                name='wallet'
                value={name}
                onChange={handleChange}
            />
        </div>
    );
};
export const WalletDialog = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    const [, setWallet] = useState<string | undefined>();

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setWallet(e.target.value);
        },
        []
    );

    const connectWallet = useCallback(() => {
        // TODO: connect wallet
        onClose();
    }, [onClose]);

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title='Select Wallet Provider'
            description='Connect your wallet to unlock and start using services
        on Secured Finance'
            callToAction='Connect Wallet'
            onClick={() => connectWallet()}
        >
            <div className='flex flex-col items-stretch justify-center'>
                <WalletProvider
                    name='Metamask'
                    key='metamask'
                    Icon={MetaMaskIcon}
                    handleChange={handleChange}
                />
                <WalletProvider
                    name='WalletConnect'
                    key='walletconnect'
                    Icon={WalletConnectIcon}
                    handleChange={handleChange}
                />
            </div>
        </Dialog>
    );
};
