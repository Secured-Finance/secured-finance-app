import { useState } from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';
import SFLogo from 'src/assets/img/logo.svg';
import { Button, NavTab, TraderProTab } from 'src/components/atoms';
import useSF from 'src/hooks/useSecuredFinance';
import { capitalizeFirstLetter } from 'src/utils';
import { AddressUtils } from 'src/utils/address';
import { useWallet } from 'use-wallet';
import { WalletDialog } from '../WalletDialog';
import { WalletPopover } from '../WalletPopover/WalletPopover';

export const Header = () => {
    const [display, setDisplay] = useState(false);
    const { account } = useWallet();
    const securedFinance = useSF();

    return (
        <nav
            data-cy='header'
            className={`flex h-20 w-full flex-row items-center justify-between border-b border-neutral1 ${
                display ? 'blur-sm' : ''
            }`}
        >
            <NavLink
                className='ml-5 flex h-10 items-center justify-center'
                to='/'
            >
                <SFLogo className='h-10 w-[200px]' />
            </NavLink>
            <div className='flex items-center justify-center'>
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
                        networkName={capitalizeFirstLetter(
                            securedFinance?.network
                        )}
                        data-cy='popover'
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
                data-cy='modal'
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
    const useCheckActive = (): boolean => {
        return useRouteMatch({ path: link, exact: true }) ? true : false;
    };
    return (
        <NavLink exact data-cy={dataCy.toLowerCase()} to={link}>
            <NavTab text={text} active={useCheckActive()} />
        </NavLink>
    );
};
