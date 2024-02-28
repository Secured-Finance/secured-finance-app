import { ChevronDownIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import SFLogo from 'src/assets/img/logo.svg';
import SFLogoSmall from 'src/assets/img/small-logo.svg';
import { Button, NavTab, SupportedNetworks } from 'src/components/atoms';
import {
    HamburgerMenu,
    MenuPopover,
    NetworkSelector,
    Settings,
} from 'src/components/molecules';
import { WalletDialog, WalletPopover } from 'src/components/organisms';
import { useBreakpoint, useIsGlobalItayose } from 'src/hooks';
import useSF from 'src/hooks/useSecuredFinance';
import { setWalletDialogOpen } from 'src/store/interactions';
import { RootState } from 'src/store/types';
import { ButtonSizes } from 'src/types';
import { getSupportedNetworks } from 'src/utils';
import { AddressUtils } from 'src/utils/address';
import { isProdEnv } from 'src/utils/displayUtils';
import { useAccount } from 'wagmi';

const PRODUCTION_LINKS = [
    {
        text: 'OTC Lending',
        link: '/',
        alternateLinks: ['/advanced', '/global-itayose', '/itayose'],
        dataCy: 'lending',
    },
    {
        text: 'Markets',
        link: '/dashboard',
        dataCy: 'terminal',
    },
    {
        text: 'Portfolio',
        link: '/portfolio',
        dataCy: 'history',
    },
];

const DEV_LINKS = [
    ...PRODUCTION_LINKS,
    {
        text: 'Faucet',
        link: '/faucet',
        dataCy: 'faucet',
    },
];

const HeaderMessage = ({
    chainId,
    chainError,
}: {
    chainId: number;
    chainError: boolean;
}) => {
    if (chainId) {
        if (chainError) {
            return (
                <div
                    className='typography-caption-2 w-full bg-red p-[1px] text-center text-neutral-8'
                    data-testid='testnet-alert'
                >
                    <SupportedNetworks />
                </div>
            );
        } else if (
            getSupportedNetworks().find(n => n.id === chainId)?.testnet
        ) {
            return (
                <div
                    className='typography-caption-2 w-full bg-horizonBlue p-[1px] text-center text-neutral-8'
                    data-testid='testnet-info'
                >
                    You are visiting Secured Finance on testnet
                </div>
            );
        }
    }
    return <></>;
};

export const Header = ({ showNavigation }: { showNavigation: boolean }) => {
    const dispatch = useDispatch();
    const isMobile = useBreakpoint('tablet');
    const { address, isConnected } = useAccount();
    const securedFinance = useSF();
    const chainError = useSelector(
        (state: RootState) => state.blockchain.chainError
    );
    const currentChainId = useSelector(
        (state: RootState) => state.blockchain.chainId
    );
    const isProduction = isProdEnv();

    const { data: isGlobalItayose } = useIsGlobalItayose();

    const landingPage = PRODUCTION_LINKS.find(obj => obj.dataCy === 'lending');

    if (landingPage) {
        if (isGlobalItayose) {
            landingPage.link = '/itayose';
        } else {
            landingPage.link = '/';
        }
    }

    const LINKS = isProduction ? PRODUCTION_LINKS : DEV_LINKS;

    let buttonSize = ButtonSizes.xs;

    if (!isMobile) {
        buttonSize = ButtonSizes.md;
    }

    return (
        <div className='relative'>
            <HeaderMessage chainId={currentChainId} chainError={chainError} />
            <nav
                data-cy='header'
                className='grid h-[4.5rem] w-full grid-flow-col items-center border-b border-neutral-1 px-6 py-[1.375rem] tablet:px-5 tablet:py-0 laptop:grid-flow-col'
            >
                <div className='col-span-2 flex h-full flex-row items-center gap-3 tablet:gap-4'>
                    <Link href='/' passHref>
                        <a
                            href='_'
                            className='flex items-center tablet:h-10 tablet:border-r tablet:border-neutral-800 tablet:pr-4'
                        >
                            <SFLogo className='hidden tablet:flex tablet:h-[15px] tablet:w-[150px]' />
                            <SFLogoSmall className='inline h-7 w-7 tablet:hidden' />
                        </a>
                    </Link>
                    <button className='hidden items-center gap-1 text-sm text-neutral-50 tablet:flex laptop:hidden'>
                        Menu{' '}
                        <ChevronDownIcon className='h-4 w-4 text-neutral-400' />
                    </button>
                    {showNavigation && (
                        <div className='hidden h-full flex-row laptop:flex'>
                            {LINKS.map(link => (
                                <div key={link.text} className='h-full w-full'>
                                    <ItemLink
                                        text={link.text}
                                        dataCy={link.dataCy}
                                        link={link.link}
                                        alternateLinks={link?.alternateLinks}
                                    />
                                </div>
                            ))}
                            <MenuPopover />
                        </div>
                    )}
                </div>
                <div className='col-span-2 flex flex-row items-center justify-end gap-2 tablet:gap-3 laptop:col-span-1 laptop:gap-4'>
                    {isConnected && address ? (
                        <>
                            <NetworkSelector networkName={'Unknown'} />
                            <WalletPopover
                                wallet={AddressUtils.format(
                                    address,
                                    isMobile ? 2 : 6
                                )}
                                networkName={
                                    securedFinance?.config?.network ?? 'Unknown'
                                }
                            />
                            <Settings isProduction={isProduction} />
                        </>
                    ) : (
                        <Button
                            size={buttonSize}
                            className='mr-1 tablet:mr-0'
                            data-cy='wallet'
                            data-testid='connect-wallet'
                            onClick={() => dispatch(setWalletDialogOpen(true))}
                        >
                            Connect Wallet
                        </Button>
                    )}

                    <div className='flex tablet:hidden'>
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
    alternateLinks,
}: {
    text: string;
    dataCy: string;
    link: string;
    alternateLinks?: string[];
}) => {
    const router = useRouter();
    const useCheckActive = () => {
        return (
            router.pathname === link ||
            !!alternateLinks?.includes(router.pathname)
        );
    };
    return (
        <Link href={link} className='h-full' passHref>
            <a className='h-full' href='_' data-cy={dataCy.toLowerCase()}>
                <NavTab text={text} active={useCheckActive()} />
            </a>
        </Link>
    );
};
