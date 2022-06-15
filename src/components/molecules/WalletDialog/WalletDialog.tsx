import { Dialog } from '@headlessui/react';
import { SVGProps, useState } from 'react';
import { ReactComponent as MetaMaskIcon } from 'src/assets/img/metamask-fox.svg';
import { ReactComponent as WalletConnectIcon } from 'src/assets/img/wallet-connect.svg';

import { Button } from 'src/components/atoms';

const WalletProvider = ({
    name,
    Icon,
}: {
    name: string;
    Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
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
            />
        </div>
    );
};
export const WalletDialog = ({ open }: { open: boolean }) => {
    const [isOpen, setIsOpen] = useState(open);

    return (
        <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            className='relative z-50'
        >
            <div className='fixed inset-0 flex items-center justify-center p-4'>
                <Dialog.Panel className='w-full max-w-sm rounded-xl bg-secondary-500 p-10'>
                    <Dialog.Title className='p-4 text-center text-2xl text-white'>
                        Select Wallet Provider
                    </Dialog.Title>
                    <Dialog.Description className='pb-8 text-center text-base text-gray-400'>
                        Connect your wallet to unlock and start using services
                        on Secured Finance
                    </Dialog.Description>
                    <div className='flex flex-col items-stretch justify-center'>
                        <WalletProvider name='Metamask' Icon={MetaMaskIcon} />
                        <WalletProvider
                            name='WalletConnect'
                            Icon={WalletConnectIcon}
                        />
                    </div>
                    <div className='pt-8'>
                        <Button size='md'>Connect Wallet</Button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};
