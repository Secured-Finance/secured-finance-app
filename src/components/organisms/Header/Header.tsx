import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import SFLogo from 'src/assets/img/logo.svg';
import SFLogoSmall from 'src/assets/img/small-logo.svg';
import { Button, NavTab } from 'src/components/atoms';
import { HamburgerMenu, MenuPopover } from 'src/components/molecules';
import { WalletDialog, WalletPopover } from 'src/components/organisms';
import useSF from 'src/hooks/useSecuredFinance';
import { setWalletDialogOpen } from 'src/store/interactions';
import { RootState } from 'src/store/types';
import { getEnvShort } from 'src/utils';
import { AddressUtils } from 'src/utils/address';
import { useWallet } from 'use-wallet';

const LINKS = [
    {
        text: 'OTC Lending',
        link: '/',
        alternateLink: '/advanced',
        dataCy: 'lending',
    },
    {
        text: 'Market Dashboard',
        link: '/dashboard',
        dataCy: 'terminal',
    },
    {
        text: 'Portfolio Management',
        link: '/portfolio',
        dataCy: 'history',
    },
];

export const Header = () => {
    const dispatch = useDispatch();
    const { account } = useWallet();
    const securedFinance = useSF();
    const chainError = useSelector(
        (state: RootState) => state.blockchain.chainError
    );
    const open = useSelector(
        (state: RootState) => state.interactions.walletDialogOpen
    );
    const envShort = getEnvShort();

    return (
        <div className='relative'>
            {!chainError && (
                <div className='typography-caption-2 w-full bg-horizonBlue/100 p-[1px] text-center text-neutral-8'>
                    You are visiting Secured Finance on testnet
                </div>
            )}
            <nav
                data-cy='header'
                className={classNames(
                    'grid h-20 w-full grid-flow-col border-b border-neutral-1 laptop:grid-cols-7',
                    {
                        'blur-sm': open,
                    }
                )}
            >
                <div className='col-span-2 flex flex-row items-center gap-3'>
                    <Link href='/' passHref>
                        <a href='_'>
                            <SFLogo className='hidden tablet:inline tablet:h-10 tablet:w-[200px]' />
                            <SFLogoSmall className='inline h-7 w-7 tablet:hidden' />
                        </a>
                    </Link>
                    {envShort && (
                        <div className='typography-dropdown-selection-label flex h-5 w-10 items-center justify-center rounded-3xl bg-starBlue font-semibold uppercase text-white'>
                            {envShort}
                        </div>
                    )}
                </div>
                {LINKS.map(link => (
                    <div
                        key={link.text}
                        className='hidden h-full w-full laptop:inline'
                    >
                        <ItemLink
                            text={link.text}
                            dataCy={link.dataCy}
                            link={link.link}
                            alternateLink={link?.alternateLink}
                        />
                    </div>
                ))}
                <div className='hidden h-full w-full laptop:inline'>
                    <MenuPopover />
                </div>
                <div className='col-span-2 flex flex-row items-center justify-end gap-2 laptop:col-span-1'>
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
                        >
                            Connect Wallet
                        </Button>
                    )}

                    <div className='inline laptop:hidden'>
                        <HamburgerMenu
                            links={LINKS.map(link => ({
                                label: link.text,
                                link: link.link,
                            }))}
                        />
                    </div>
                </div>
                <WalletDialog />
            </nav>
        </div>
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
