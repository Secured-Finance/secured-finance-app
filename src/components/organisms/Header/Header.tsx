import { NavLink, useRouteMatch } from 'react-router-dom';
import { ReactComponent as SFLogo } from 'src/assets/img/logo.svg';
import { Button } from 'src/components/atoms';
import { NavTab } from 'src/components/atoms/NavTab';
import { useState, Fragment } from 'react';
import WalletDialog from '../WalletDialog';
import { Transition } from '@headlessui/react';

export const Header = (): JSX.Element => {
    const [display, setDisplay] = useState(false);

    return (
        <div
            data-cy='header'
            className='flex h-20 w-full flex-row justify-between border-b border-neutral1'
        >
            <NavLink
                className='ml-5 mt-5 flex h-10 items-center justify-center'
                to='/'
            >
                <SFLogo />
            </NavLink>
            <div className='flex items-center justify-center'>
                <ItemLink text='OTC Lending' link='/' />
                <ItemLink text='Market Dashboard' link='/exchange' />
                <ItemLink text='Portfolio Management' link='/history' />
            </div>
            <div className='mr-5 mt-5'>
                <Button onClick={() => setDisplay(true)}>Connect Wallet</Button>
            </div>
            <WalletDialog
                isOpen={display}
                onClose={() => setDisplay(false)}
            ></WalletDialog>
        </div>
    );
};

const ItemLink = ({ text, link }: { text: string; link: string }) => {
    const useCheckActive = (): boolean => {
        return useRouteMatch({ path: link, exact: true });
    };
    return (
        <NavLink exact data-cy={text.toLowerCase()} to={link}>
            <NavTab text={text} active={useCheckActive()} />
        </NavLink>
    );
};
