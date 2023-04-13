import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import SFLogo from 'src/assets/img/logo.svg';
import { Button, NavTab } from 'src/components/atoms';
import { MenuPopover } from 'src/components/molecules';
import { WalletDialog, WalletPopover } from 'src/components/organisms';
import useSF from 'src/hooks/useSecuredFinance';
import { setWalletDialogOpen } from 'src/store/interactions';
import { RootState } from 'src/store/types';
import { getEnvShort, getEnvironment } from 'src/utils';
import { AddressUtils } from 'src/utils/address';
import { useWallet } from 'use-wallet';

export const Header = () => {
    const dispatch = useDispatch();
    const { account } = useWallet();
    const securedFinance = useSF();
    const status = useSelector(
        (state: RootState) => state.blockchain.chainError
    );
    const open = useSelector(
        (state: RootState) => state.interactions.walletDialogOpen
    );
    const envShort = getEnvShort(getEnvironment());

    return (
        <nav
            data-cy='header'
            className={`flex h-20 w-full flex-row items-center justify-between border-b border-neutral-1 ${
                open ? 'blur-sm' : ''
            }`}
        >
            <div className='ml-5 flex flex-row items-center gap-3'>
                <Link href='/' passHref>
                    <a href='_'>
                        <SFLogo className='h-10 w-[200px]' />
                    </a>
                </Link>
                {envShort && (
                    <div className='typography-dropdown-selection-label flex h-5 w-10 items-center justify-center rounded-3xl bg-starBlue font-semibold uppercase text-white'>
                        {envShort}
                    </div>
                )}
            </div>
            <div className='flex h-full items-center justify-center'>
                <ItemLink
                    text='OTC Lending'
                    dataCy='lending'
                    link='/'
                    alternateLink='/advanced'
                />
                <ItemLink
                    text='Market Dashboard'
                    dataCy='terminal'
                    link='/dashboard'
                />
                <ItemLink
                    text='Portfolio Management'
                    dataCy='history'
                    link='/portfolio'
                />
                <ItemLink text='Faucet' dataCy='faucet' link='/faucet' />
                <MenuPopover />
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
                    <Button
                        data-cy='wallet'
                        data-testid='connect-wallet'
                        onClick={() => dispatch(setWalletDialogOpen(true))}
                        disabled={status}
                    >
                        Connect Wallet
                    </Button>
                )}
            </div>
            <WalletDialog />
        </nav>
    );
};

const ItemLink = ({
    text,
    dataCy,
    link,
    alternateLink,
}: {
    text: string;
    dataCy: string;
    link: string;
    alternateLink?: string;
}) => {
    const router = useRouter();
    const useCheckActive = () => {
        return router.pathname === link || router.pathname === alternateLink;
    };
    return (
        <Link href={link} className='h-full' passHref>
            <a className='h-full' href='_' data-cy={dataCy.toLowerCase()}>
                <NavTab text={text} active={useCheckActive()} />
            </a>
        </Link>
    );
};
