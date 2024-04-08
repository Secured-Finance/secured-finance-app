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

const Header = ({ showNavigation }: { showNavigation: boolean }) => {
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

    return (
        <div className='relative'>
            <HeaderMessage chainId={currentChainId} chainError={chainError} />
            <nav
                data-cy='header'
                className='grid h-14 w-full grid-flow-col border-b border-neutral-1 px-5 tablet:h-20 laptop:grid-flow-col'
            >
                <div className='col-span-2 flex flex-row items-center gap-3'>
                    <Link href='/' passHref>
                        <a href='_'>
                            <SFLogo className='hidden tablet:inline tablet:h-10 tablet:w-[200px]' />
                            <SFLogoSmall className='inline h-7 w-7 tablet:hidden' />
                        </a>
                    </Link>
                    {showNavigation && (
                        <div className='flex h-full flex-row tablet:pl-12'>
                            {LINKS.map(link => (
                                <div
                                    key={link.text}
                                    className='hidden h-full w-full laptop:inline'
                                >
                                    <ItemLink
                                        text={link.text}
                                        dataCy={link.dataCy}
                                        link={link.link}
                                        alternateLinks={link?.alternateLinks}
                                    />
                                </div>
                            ))}
                            <div className='hidden laptop:inline'>
                                <MenuPopover />
                            </div>
                        </div>
                    )}
                </div>
                <div className='col-span-2 flex flex-row items-center justify-end gap-2 laptop:col-span-1'>
                    {isConnected && address ? (
                        <>
                            <NetworkSelector
                                networkName={
                                    securedFinance?.config?.network ?? 'Unknown'
                                }
                            />
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
                            size={isMobile ? 'sm' : undefined}
                            data-cy='wallet'
                            data-testid='connect-wallet'
                            onClick={() => dispatch(setWalletDialogOpen(true))}
                        >
                            Connect Wallet
                        </Button>
                    )}

                    <div className='flex laptop:hidden'>
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

export default Header;
