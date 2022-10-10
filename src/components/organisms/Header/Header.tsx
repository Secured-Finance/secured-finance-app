import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import SFLogo from 'src/assets/img/logo.svg';
import { Button, NavTab, TraderProTab } from 'src/components/atoms';
import { WalletDialog, WalletPopover } from 'src/components/organisms';
import useSF from 'src/hooks/useSecuredFinance';
import { AddressUtils } from 'src/utils/address';
import { useWallet } from 'use-wallet';

export const Header = () => {
    const [display, setDisplay] = useState(false);
    const { account } = useWallet();
    const securedFinance = useSF();

    return (
        <nav
            data-cy='header'
            className={`flex h-20 w-full flex-row items-center justify-between border-b border-neutral-1 ${
                display ? 'blur-sm' : ''
            }`}
        >
            <Link
                className='ml-5 flex h-10 items-center justify-center'
                href='/'
            >
                <SFLogo className='h-10 w-[200px]' />
            </Link>
            <div className='flex h-full items-center justify-center'>
                <ItemLink text='OTC Lending' dataCy='lending' link='/' />
                <ItemLink
                    text='Market Dashboard'
                    dataCy='terminal'
                    link='/exchange'
                />
                <ItemLink
                    text='Portfolio Management'
                    dataCy='history'
                    link='/history'
                />
                <TraderProTab text='Trader Pro'></TraderProTab>
            </div>
            <div className='mr-5'>
                {account ? (
                    <WalletPopover
                        wallet={AddressUtils.format(account, 6)}
                        networkName={
                            securedFinance?.config?.network ?? 'Unknown'
                        }
                    />
                ) : (
                    <Button data-cy='wallet' onClick={() => setDisplay(true)}>
                        Connect Wallet
                    </Button>
                )}
            </div>
            <WalletDialog
                isOpen={display}
                onClose={() => setDisplay(false)}
            ></WalletDialog>
        </nav>
    );
};

const ItemLink = ({
    text,
    dataCy,
    link,
}: {
    text: string;
    dataCy: string;
    link: string;
}) => {
    const router = useRouter();
    const useCheckActive = (): boolean => {
        return router.pathname === link;
    };
    return (
        <Link
            data-cy={dataCy.toLowerCase()}
            href={link}
            className='h-full'
            passHref
        >
            <a className='h-full' href='_'>
                <NavTab text={text} active={useCheckActive()} />
            </a>
        </Link>
    );
};
