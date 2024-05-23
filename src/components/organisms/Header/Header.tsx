import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import SFLogo from 'src/assets/img/logo.svg';
import SFLogoSmall from 'src/assets/img/small-logo.svg';
import {
    Button,
    ButtonSizes,
    NavTab,
    SupportedNetworks,
} from 'src/components/atoms';
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
import { TradingDropdown } from './TradingDropdown';
import { DEV_LINKS, PRODUCTION_LINKS } from './constants';

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
            getSupportedNetworks().find(n => n.id === chainId)?.testnet ||
            getSupportedNetworks().find(n => n.id === chainId)?.id === 314_159
        ) {
            // NOTE: 314_159 is a testnet chain id but `viem` does not have a testnet flag for it.
            // So we are checking for the chain id to determine if it is a testnet chain.
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
                className='grid h-14 w-full grid-flow-col bg-neutral-800 px-4 tablet:h-[72px] tablet:px-5 laptop:h-20 laptop:grid-flow-col'
            >
                <div className='col-span-2 flex flex-row items-center gap-8 desktop:gap-12'>
                    <Link href='/'>
                        <SFLogo className='hidden tablet:inline tablet:h-[15px] tablet:w-[150px] desktop:h-5 desktop:w-[200px]' />
                        <SFLogoSmall className='inline h-7 w-7 tablet:hidden' />
                    </Link>
                    {showNavigation && (
                        <div className='hidden h-full flex-row laptop:flex'>
                            <TradingDropdown />
                            {LINKS.map(link => (
                                <div key={link.text} className='h-full w-full'>
                                    <ItemLink
                                        text={link.text}
                                        dataCy={link.dataCy}
                                        link={link.link}
                                    />
                                </div>
                            ))}
                            <MenuPopover />
                        </div>
                    )}
                </div>
                <div className='col-span-2 flex flex-row items-center justify-end gap-2 laptop:col-span-1 laptop:gap-2.5'>
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
                            size={isMobile ? ButtonSizes.sm : ButtonSizes.lg}
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
        <Link
            href={link}
            className='h-full'
            passHref
            data-cy={dataCy.toLowerCase()}
        >
            <NavTab text={text} active={useCheckActive()} />
        </Link>
    );
};

export default Header;
